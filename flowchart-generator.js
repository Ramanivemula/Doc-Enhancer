// Create a Mermaid.js flowchart for Doc Enhancer extension
// Save this as flowchart-generator.js and run with Node.js

const fs = require('fs');

// Define the Mermaid flowchart content
const mermaidFlowchart = `
flowchart TD
    A[Extension Activation] --> B[User invokes command]
    
    subgraph "Command Selection"
        B --> C1[Enhance]
        B --> C2[Simplify]
        B --> C3[Summarize]
        B --> C4[Translate]
        B --> C5[Make Accessible]
        B --> C6[Extract Code]
    end
    
    C1 --> D1[Get active editor text]
    C2 --> D1
    C3 --> D1
    C4 --> D2[Get active editor text\nShow language picker]
    C5 --> D1
    C6 --> D3[Get active editor text\nExtract code blocks]
    
    D1 --> E1[Show progress notification]
    D2 --> D2a{Language selected?} 
    D2a -->|Yes| E1
    D2a -->|No| Z[End process]
    D3 --> E3{Found code blocks?}
    
    E3 -->|Yes| E4[Create code_examples directory]
    E3 -->|No| E5[Show "No code blocks found" message]
    E5 --> Z
    
    E1 --> F1[Call WorqHat AI API]
    E4 --> F2[Save each code block to file]
    
    F1 --> G1{API Success?}
    F2 --> G3[Show success message]
    G3 --> Z
    
    G1 -->|Yes| G2[Generate new file with processed content]
    G1 -->|No| G4[Show error message]
    G4 --> Z
    
    G2 --> H1[Show success message]
    H1 --> Z

    classDef success fill:#d1f0d1,stroke:#59b359,stroke-width:2px
    classDef error fill:#f8d7da,stroke:#dc3545,stroke-width:2px
    classDef process fill:#d1ecf1,stroke:#0c5460,stroke-width:1px
    classDef decision fill:#fff3cd,stroke:#856404,stroke-width:1px
    
    class G2,G3,H1 success
    class G4,E5 error
    class A,B,C1,C2,C3,C4,C5,C6,D1,D2,D3,E1,E4,F1,F2 process
    class D2a,E3,G1 decision
`;

// Create HTML with embedded Mermaid
const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Doc Enhancer Extension Flowchart</title>
    <script src="https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js"></script>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .container {
            background-color: white;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            padding: 20px;
            max-width: 1200px;
            margin: 0 auto;
        }
        h1 {
            color: #333;
            text-align: center;
            margin-bottom: 20px;
        }
        .mermaid {
            display: flex;
            justify-content: center;
        }
        .legend {
            margin-top: 20px;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 4px;
        }
        .legend-item {
            display: inline-block;
            margin-right: 20px;
        }
        .legend-color {
            display: inline-block;
            width: 20px;
            height: 20px;
            margin-right: 5px;
            vertical-align: middle;
            border: 1px solid #999;
        }
        .success-color { background-color: #d1f0d1; }
        .error-color { background-color: #f8d7da; }
        .process-color { background-color: #d1ecf1; }
        .decision-color { background-color: #fff3cd; }
    </style>
</head>
<body>
    <div class="container">
        <h1>Doc Enhancer Extension Workflow</h1>
        <div class="mermaid">
${mermaidFlowchart}
        </div>
        
        <div class="legend">
            <h3>Legend:</h3>
            <div class="legend-item"><span class="legend-color process-color"></span> Process</div>
            <div class="legend-item"><span class="legend-color decision-color"></span> Decision</div>
            <div class="legend-item"><span class="legend-color success-color"></span> Success</div>
            <div class="legend-item"><span class="legend-color error-color"></span> Error</div>
        </div>
    </div>
    
    <script>
        mermaid.initialize({
            startOnLoad: true,
            theme: 'default',
            flowchart: {
                useMaxWidth: false,
                htmlLabels: true,
                curve: 'basis'
            }
        });
    </script>
</body>
</html>
`;

// Write the HTML file
fs.writeFileSync('doc-enhancer-flowchart.html', htmlContent);
console.log('Flowchart generated: doc-enhancer-flowchart.html');

// Also save the raw Mermaid code to a separate file for easy editing
fs.writeFileSync('doc-enhancer-flowchart.mmd', mermaidFlowchart.trim());
console.log('Raw Mermaid code saved: doc-enhancer-flowchart.mmd');