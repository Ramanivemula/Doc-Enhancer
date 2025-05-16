const vscode = require('vscode');
const fs = require('fs');
require('dotenv').config();
const path = require('path');
const {
  enhanceText,
  simplifyText,
  summarizeText,
  translateText,
  makeAccessible,
  generateFlowchart
} = require('./worqhatService');

function activate(context) {
  console.log("✅ Doc Enhancer Extension activated!");

  let enhanceCommand = vscode.commands.registerCommand('doc-enhancer.enhance', async function () {
    await handleTransformation('Enhancing document...', enhanceText, '_enhanced.txt');
  });

  let simplifyCommand = vscode.commands.registerCommand('doc-enhancer.simplify', async function () {
    await handleTransformation('Simplifying document...', simplifyText, '_simplified.txt');
  });

  let summarizeCommand = vscode.commands.registerCommand('doc-enhancer.summarize', async function () {
    await handleTransformation('Summarizing document...', summarizeText, '_summary.txt');
  });

  let translateCommand = vscode.commands.registerCommand('doc-enhancer.translate', async function () {
    const editor = vscode.window.activeTextEditor;
    if (!editor) return vscode.window.showInformationMessage('No active document found!');

    const document = editor.document;
    const fullText = document.getText();
    if (!fullText.trim()) return vscode.window.showInformationMessage('Document is empty.');

    const languages = ['Spanish', 'French', 'German', 'Chinese', 'Japanese', 'Hindi','Marathi','Telugu'];

    const language = await vscode.window.showQuickPick(languages, {
      placeHolder: 'Select target language for translation'
    });

    if (!language) return;

    await vscode.window.withProgress(
      { location: vscode.ProgressLocation.Notification, title: `Translating document to ${language}...`, cancellable: false },
      async () => {
        try {
          const translated = await translateText(fullText, language);
          const { dir, baseName } = getPathInfo(document.uri.fsPath);
          fs.writeFileSync(path.join(dir, `${baseName}_${language.toLowerCase()}.txt`), translated);
          vscode.window.showInformationMessage(`Document translated to ${language} successfully!`);
        } catch (error) {
          vscode.window.showErrorMessage('Error translating document.');
          console.error("❌ Translation error:", error);
        }
      }
    );
  });

  let accessibilityCommand = vscode.commands.registerCommand('doc-enhancer.makeAccessible', async function () {
    await handleTransformation('Making document more accessible...', makeAccessible, '_accessible.txt');
  });

  let flowchartCommand = vscode.commands.registerCommand('doc-enhancer.generateFlowchart', async function () {
    const editor = vscode.window.activeTextEditor;
    if (!editor) return vscode.window.showInformationMessage('No active document found!');

    const document = editor.document;
    const fullText = document.getText();
    if (!fullText.trim()) return vscode.window.showInformationMessage('Document is empty.');

    await vscode.window.withProgress(
      { location: vscode.ProgressLocation.Notification, title: "Generating flowchart from document...", cancellable: false },
      async () => {
        try {
          const flowchart = await generateFlowchart(fullText);
          const { dir, baseName } = getPathInfo(document.uri.fsPath);
          fs.writeFileSync(path.join(dir, `${baseName}_flowchart.md`), flowchart);
          vscode.window.showInformationMessage('Flowchart generated successfully!');
        } catch (error) {
          vscode.window.showErrorMessage('Error generating flowchart.');
          console.error("❌ Flowchart error:", error);
        }
      }
    );
  });

  let extractCodeCommand = vscode.commands.registerCommand('doc-enhancer.extractCode', async function () {
    const editor = vscode.window.activeTextEditor;
    if (!editor) return vscode.window.showInformationMessage('No active document found!');

    const document = editor.document;
    const fullText = document.getText();
    if (!fullText.trim()) return vscode.window.showInformationMessage('Document is empty.');

    const codeBlockRegex = /```(\w+)?\s*([\s\S]*?)```/g;
    let match;
    const codeBlocks = [];

    while ((match = codeBlockRegex.exec(fullText)) !== null) {
      const language = match[1] || 'text';
      const code = match[2].trim();
      codeBlocks.push({ language, code });
    }

    if (codeBlocks.length === 0) {
      return vscode.window.showInformationMessage('No code blocks found in document.');
    }

    const { dir, baseName } = getPathInfo(document.uri.fsPath);
    const codeDir = path.join(dir, `${baseName}_code_examples`);
    if (!fs.existsSync(codeDir)) fs.mkdirSync(codeDir);

    codeBlocks.forEach((block, index) => {
      const extension = getFileExtension(block.language);
      fs.writeFileSync(path.join(codeDir, `example_${index + 1}${extension}`), block.code);
    });

    vscode.window.showInformationMessage(`Extracted ${codeBlocks.length} code examples to ${codeDir}`);
  });

  context.subscriptions.push(
    enhanceCommand,
    simplifyCommand,
    summarizeCommand,
    translateCommand,
    accessibilityCommand,
    flowchartCommand,
    extractCodeCommand
  );
}

// Helper: General transformation handler
async function handleTransformation(title, transformFunction, fileSuffix) {
  const editor = vscode.window.activeTextEditor;
  if (!editor) return vscode.window.showInformationMessage('No active document found!');

  const document = editor.document;
  const fullText = document.getText();
  if (!fullText.trim()) return vscode.window.showInformationMessage('Document is empty.');

  await vscode.window.withProgress(
    { location: vscode.ProgressLocation.Notification, title, cancellable: false },
    async () => {
      try {
        const result = await transformFunction(fullText);
        const { dir, baseName } = getPathInfo(document.uri.fsPath);
        fs.writeFileSync(path.join(dir, `${baseName}${fileSuffix}`), result);
        vscode.window.showInformationMessage(`${fileSuffix.replace(/_/g, ' ').replace('.txt', '')} file created successfully!`);
      } catch (error) {
        vscode.window.showErrorMessage(`Error during ${fileSuffix.replace('_', '').replace('.txt', '')}.`);
        console.error("❌ Transformation error:", error);
      }
    }
  );
}

// Helper: Get file extension from language
function getFileExtension(language) {
  const extensionMap = {
    'javascript': '.js', 'typescript': '.ts', 'python': '.py', 'java': '.java',
    'csharp': '.cs', 'c': '.c', 'cpp': '.cpp', 'ruby': '.rb', 'php': '.php',
    'go': '.go', 'rust': '.rs', 'swift': '.swift', 'kotlin': '.kt', 'html': '.html',
    'css': '.css', 'json': '.json', 'xml': '.xml', 'yaml': '.yml', 'bash': '.sh',
    'shell': '.sh', 'sql': '.sql'
  };
  return extensionMap[language.toLowerCase()] || '.txt';
}

// Helper: Get directory & base file name
function getPathInfo(filePath) {
  return {
    dir: path.dirname(filePath),
    baseName: path.basename(filePath, path.extname(filePath))
  };
}

function deactivate() {}

module.exports = {
  activate,
  deactivate
};
