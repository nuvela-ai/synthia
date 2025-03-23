from server import UploadFragment, QueryFragment, CalculateContribution

# Upload a fragment
paragraphs = ["Photosynthesis is the process by which green plants, algae, and some bacteria convert light energy into chemical energy. Using chlorophyll, they absorb sunlight and use it to transform carbon dioxide and water into glucose and oxygen, playing a critical role in Earth's carbon cycle.",
"Quantum mechanics is a fundamental theory in physics that describes nature at the smallest scales, such as atomic and subatomic particles. It introduces concepts like wave-particle duality, superposition, and entanglement, challenging classical notions of reality.",
"The human genome consists of approximately 3 billion base pairs of DNA, encoding around 20,000-25,000 genes. Advances in genomics have enabled scientists to identify genetic markers for diseases, paving the way for personalized medicine.",
"The Model Context Protocol is an open standard that enables developers to build secure, two-way connections between their data sources and AI-powered tools. The architecture is straightforward: developers can either expose their data through MCP servers or build AI applications (MCP clients) that connect to these servers.",
"Claude 3.5 Sonnet is adept at quickly building MCP server implementations, making it easy for organizations and individuals to rapidly connect their most important datasets with a range of AI-powered tools. To help developers start exploring, we’re sharing pre-built MCP servers for popular enterprise systems like Google Drive, Slack, GitHub, Git, Postgres, and Puppeteer.",
"As AI assistants gain mainstream adoption, the industry has invested heavily in model capabilities, achieving rapid advances in reasoning and quality. Yet even the most sophisticated models are constrained by their isolation from data—trapped behind information silos and legacy systems. Every new data source requires its own custom implementation, making truly connected systems difficult to scale."            
]
for p in paragraphs:
    UploadFragment({"text": p}) #returns (id, vector, {"metadata": str(data)})



#Retrieve similar fragments
prompt = "Tell me about Model Context Protocol"
QueryFragment(prompt) # returns something like the following:
# {'matches': [{'id': 'bird',
#               'metadata': {'metadata_key': PARAGRAPH},
#               'score': 1.00039208,
#               'values': []},
#              {'id': 'dog',
#               'metadata': {'metadata_key': PARAGRAPH},
#               'score': 0.410071,
#               'values': []}],
#  'namespace': 'mcp-namespace',
#  'usage': {'read_units': 6}} YOU WILL NEED TO RETURN THE IDS LATER FOR CONTRIBUTION CALCULATION



#Calculate the contribution of selected fragments to a paper
paper = "The Model Context Protocol (MCP) is an open standard that enables developers to build secure, two-way connections between their data sources and AI-powered tools. It provides a straightforward architecture for exposing data through MCP servers or building AI applications that connect to these servers."
# fragmentList = [] #TODO send the unique ids of the fragments you uploaded
# CalculateContribution(paper, fragmentList)