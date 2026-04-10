from flask import Flask, request, jsonify
from flask_cors import CORS
import torch
import torch.nn as nn
from torchvision import models, transforms
from PIL import Image

app = Flask(__name__)
CORS(app)

# ✅ CLASSES
classes = ['Maize grasshoper', 'Cassava mosaic', 'Tomato septoria leaf spot', 'Cashew leaf miner', 'Maize leaf beetle',
              'Cassava bacterial blight', 'Maize streak virus', 'Cashew red rust', 'Tomato verticulium wilt', 'Tomato leaf curl',
              'Maize leaf spot', 'Maize fall armyworm', 'Cassava healthy', 'Cashew anthracnose', 'Maize healthy', 'Tomato leaf blight',
              'Maize leaf blight', 'Cassava green mite', 'Cashew healthy', 'Cashew gumosis', 'Tomato healthy', 'Cassava brown spot']

# ✅ DISEASE INFO DATABASE
disease_info = {
    "Maize grasshoper": {
        "severity": "Moderate",
        "description": "Grasshoppers are significant pests of maize that feed on leaves, reducing the plant's photosynthetic capacity. Heavy infestations can cause severe defoliation, leading to stunted growth and reduced grain yield.",
        "symptoms": ["Irregular holes and chewed leaf edges", "Defoliation starting from leaf margins", "Visible grasshoppers on plants", "Reduced plant vigor and stunted growth"],
        "pesticides": [
            {"name": "Chlorpyrifos 20% EC", "dosage": "2 ml per liter of water", "application": "Foliar spray during early morning or evening", "type": "Insecticide"},
            {"name": "Malathion 50% EC", "dosage": "2 ml per liter of water", "application": "Spray on foliage when pests are noticed", "type": "Insecticide"},
            {"name": "Carbaryl 50% WP", "dosage": "2 grams per liter of water", "application": "Dust or spray application on affected plants", "type": "Insecticide"}
        ]
    },
    "Cassava mosaic": {
        "severity": "Severe",
        "description": "Cassava Mosaic Disease (CMD) is caused by geminiviruses transmitted by whiteflies. It is one of the most damaging diseases of cassava in Africa and Asia, causing significant yield losses up to 95% in severe cases.",
        "symptoms": ["Yellow-green mosaic patterns on leaves", "Leaf curling and distortion", "Stunted plant growth", "Reduced root tuber size"],
        "pesticides": [
            {"name": "Imidacloprid 17.8% SL", "dosage": "0.5 ml per liter of water", "application": "Spray to control whitefly vectors", "type": "Systemic Insecticide"},
            {"name": "Thiamethoxam 25% WG", "dosage": "0.3 grams per liter of water", "application": "Foliar spray for whitefly management", "type": "Neonicotinoid"},
            {"name": "Neem Oil 1500 ppm", "dosage": "5 ml per liter of water", "application": "Spray as organic repellent every 10-14 days", "type": "Bio-pesticide"}
        ]
    },
    "Tomato septoria leaf spot": {
        "severity": "Moderate",
        "description": "Septoria leaf spot is caused by the fungus Septoria lycopersici. It primarily affects the lower leaves and can spread upward. The disease thrives in warm, wet conditions and can cause significant defoliation if untreated.",
        "symptoms": ["Small dark spots with gray centers on lower leaves", "Yellow halos around leaf spots", "Progressive defoliation from bottom upward", "Tiny black pycnidia visible in spot centers"],
        "pesticides": [
            {"name": "Mancozeb 75% WP", "dosage": "2-2.5 grams per liter of water", "application": "Foliar spray every 7-10 days", "type": "Fungicide"},
            {"name": "Chlorothalonil 75% WP", "dosage": "2 grams per liter of water", "application": "Apply as preventive spray", "type": "Fungicide"},
            {"name": "Copper Oxychloride 50% WP", "dosage": "3 grams per liter of water", "application": "Spray at 10-day intervals during wet weather", "type": "Fungicide"}
        ]
    },
    "Cashew leaf miner": {
        "severity": "Moderate",
        "description": "Cashew leaf miners are small moth larvae that tunnel between the upper and lower surfaces of cashew leaves. They create serpentine mines that reduce the photosynthetic area and weaken the tree over time.",
        "symptoms": ["Serpentine or blotch mines on leaf surface", "Silvery or whitish trails on leaves", "Premature leaf drop", "Reduced canopy density"],
        "pesticides": [
            {"name": "Monocrotophos 36% SL", "dosage": "1.5 ml per liter of water", "application": "Foliar spray when mines first appear", "type": "Systemic Insecticide"},
            {"name": "Dimethoate 30% EC", "dosage": "2 ml per liter of water", "application": "Spray on affected foliage", "type": "Systemic Insecticide"},
            {"name": "Neem Oil 1500 ppm", "dosage": "5 ml per liter of water", "application": "Spray as preventive every 14 days", "type": "Bio-pesticide"}
        ]
    },
    "Maize leaf beetle": {
        "severity": "Moderate",
        "description": "Maize leaf beetles feed on the leaf surface, creating characteristic parallel scratches along the leaf veins. Severe infestations can lead to significant leaf area loss and reduced crop productivity.",
        "symptoms": ["Parallel scratches or windowpane-like feeding marks", "Skeletonized leaves with transparent patches", "Adult beetles visible on leaves", "Reduced leaf greenness and vigor"],
        "pesticides": [
            {"name": "Lambda-cyhalothrin 5% EC", "dosage": "1 ml per liter of water", "application": "Foliar spray when beetle population is high", "type": "Pyrethroid Insecticide"},
            {"name": "Chlorpyrifos 20% EC", "dosage": "2 ml per liter of water", "application": "Spray on infested plants", "type": "Insecticide"},
            {"name": "Fipronil 5% SC", "dosage": "1.5 ml per liter of water", "application": "Seed treatment or foliar application", "type": "Insecticide"}
        ]
    },
    "Cassava bacterial blight": {
        "severity": "High",
        "description": "Cassava Bacterial Blight (CBB) is caused by Xanthomonas axonopodis pv. manihotis. It is a major disease that causes angular leaf spots, wilting, and die-back, potentially destroying entire plantations in favorable conditions.",
        "symptoms": ["Angular water-soaked leaf spots", "Gum exudation from stems", "Wilting and die-back of shoots", "Leaf blight and defoliation"],
        "pesticides": [
            {"name": "Copper Hydroxide 77% WP", "dosage": "2.5 grams per liter of water", "application": "Spray every 14 days during wet season", "type": "Bactericide"},
            {"name": "Streptomycin Sulphate 9% + Tetracycline 1%", "dosage": "0.5 grams per liter of water", "application": "Spray at first sign of symptoms", "type": "Antibiotic"},
            {"name": "Bordeaux Mixture", "dosage": "1% concentration", "application": "Preventive spray during rainy season", "type": "Fungicide/Bactericide"}
        ]
    },
    "Maize streak virus": {
        "severity": "Severe",
        "description": "Maize Streak Virus (MSV) is transmitted by leafhoppers and is the most important viral disease of maize in Africa. Infected plants show characteristic yellow streaks on leaves and suffer severe yield reduction.",
        "symptoms": ["Yellow streaks running parallel to leaf veins", "Stunted plant growth", "Reduced ear size and grain fill", "Pale yellow discoloration of young leaves"],
        "pesticides": [
            {"name": "Imidacloprid 70% WS", "dosage": "5 grams per kg of seed", "application": "Seed treatment before planting", "type": "Systemic Insecticide"},
            {"name": "Thiamethoxam 25% WG", "dosage": "0.3 grams per liter of water", "application": "Foliar spray to control leafhoppers", "type": "Neonicotinoid"},
            {"name": "Acetamiprid 20% SP", "dosage": "0.3 grams per liter of water", "application": "Spray at 2-3 leaf stage for vector control", "type": "Insecticide"}
        ]
    },
    "Cashew red rust": {
        "severity": "Moderate",
        "description": "Red rust of cashew is caused by the alga Cephaleuros virescens. It appears as reddish-brown patches on leaves and stems, reducing photosynthesis and weakening the tree, especially in humid conditions.",
        "symptoms": ["Reddish-brown velvety patches on leaves", "Circular to irregular rust-colored spots", "Premature leaf fall", "Bark cracking on tender stems"],
        "pesticides": [
            {"name": "Copper Oxychloride 50% WP", "dosage": "3 grams per liter of water", "application": "Spray twice at 15-day intervals", "type": "Fungicide"},
            {"name": "Bordeaux Mixture 1%", "dosage": "10 grams CuSO4 + 10 grams lime per liter", "application": "Preventive spray before monsoon", "type": "Fungicide"},
            {"name": "Mancozeb 75% WP", "dosage": "2.5 grams per liter of water", "application": "Foliar spray at 10-14 day intervals", "type": "Fungicide"}
        ]
    },
    "Tomato verticulium wilt": {
        "severity": "High",
        "description": "Verticillium wilt is caused by the soil-borne fungus Verticillium dahliae. It infects tomato plants through roots and blocks water-conducting vessels, causing wilting, yellowing, and eventual plant death.",
        "symptoms": ["V-shaped yellowing on leaf margins", "One-sided wilting of plant", "Brown discoloration of vascular tissue", "Progressive wilting despite adequate moisture"],
        "pesticides": [
            {"name": "Carbendazim 50% WP", "dosage": "1 gram per liter of water", "application": "Soil drench around plant base", "type": "Systemic Fungicide"},
            {"name": "Trichoderma viride", "dosage": "5 grams per liter of water", "application": "Soil application at planting", "type": "Bio-fungicide"},
            {"name": "Thiophanate Methyl 70% WP", "dosage": "1 gram per liter of water", "application": "Soil drench every 21 days", "type": "Systemic Fungicide"}
        ]
    },
    "Tomato leaf curl": {
        "severity": "Severe",
        "description": "Tomato Leaf Curl Virus (ToLCV) is a devastating begomovirus transmitted by whiteflies. It causes severe leaf curling, stunting, and flower drop, leading to near-total yield loss in susceptible varieties.",
        "symptoms": ["Upward curling and cupping of leaves", "Yellowing of leaf margins", "Severe stunting of plants", "Flower drop and reduced fruit set"],
        "pesticides": [
            {"name": "Imidacloprid 17.8% SL", "dosage": "0.5 ml per liter of water", "application": "Spray to control whitefly vectors", "type": "Systemic Insecticide"},
            {"name": "Fipronil 5% SC", "dosage": "1.5 ml per liter of water", "application": "Foliar spray every 15 days", "type": "Insecticide"},
            {"name": "Yellow Sticky Traps", "dosage": "20-25 traps per acre", "application": "Place at canopy level to monitor and trap whiteflies", "type": "Physical Control"}
        ]
    },
    "Maize leaf spot": {
        "severity": "Moderate",
        "description": "Maize leaf spots can be caused by various fungi including Bipolaris and Cercospora species. These diseases create lesions on leaves that reduce photosynthetic area and can lead to premature leaf senescence.",
        "symptoms": ["Small to medium tan or brown oval spots", "Spots may have darker borders", "Lesions coalesce causing large necrotic areas", "Premature leaf drying"],
        "pesticides": [
            {"name": "Propiconazole 25% EC", "dosage": "1 ml per liter of water", "application": "Foliar spray at disease onset", "type": "Systemic Fungicide"},
            {"name": "Mancozeb 75% WP", "dosage": "2.5 grams per liter of water", "application": "Preventive spray every 10-14 days", "type": "Fungicide"},
            {"name": "Azoxystrobin 23% SC", "dosage": "1 ml per liter of water", "application": "Spray at first sign of spots", "type": "Strobilurin Fungicide"}
        ]
    },
    "Maize fall armyworm": {
        "severity": "Severe",
        "description": "Fall armyworm (Spodoptera frugiperda) is a highly destructive pest of maize. The larvae feed on leaves and can bore into the whorl, causing severe defoliation and direct damage to developing ears.",
        "symptoms": ["Ragged feeding damage on leaves", "Presence of larvae in leaf whorls", "Frass (insect excrement) visible in whorls", "Windowpane-like damage on young leaves"],
        "pesticides": [
            {"name": "Emamectin Benzoate 5% SG", "dosage": "0.4 grams per liter of water", "application": "Spray directed into the whorl", "type": "Insecticide"},
            {"name": "Spinetoram 11.7% SC", "dosage": "0.5 ml per liter of water", "application": "Foliar spray at early larval stage", "type": "Spinosyn Insecticide"},
            {"name": "Chlorantraniliprole 18.5% SC", "dosage": "0.3 ml per liter of water", "application": "Spray at egg hatch or early instar", "type": "Anthranilic Diamide"}
        ]
    },
    "Cassava healthy": {
        "severity": "None",
        "description": "The cassava plant appears healthy with no visible signs of pest damage or disease. Leaves show normal green coloration, shape, and vigor. Continue regular monitoring and preventive care practices.",
        "symptoms": ["No symptoms detected — plant appears healthy"],
        "pesticides": []
    },
    "Cashew anthracnose": {
        "severity": "High",
        "description": "Cashew anthracnose is caused by the fungus Colletotrichum gloeosporioides. It affects leaves, shoots, and developing nuts, causing dark lesions, blossom blight, and nut drop, leading to significant economic losses.",
        "symptoms": ["Dark brown to black lesions on leaves", "Necrotic spots on flowers and young nuts", "Die-back of tender shoots", "Premature fruit and nut drop"],
        "pesticides": [
            {"name": "Carbendazim 50% WP", "dosage": "1 gram per liter of water", "application": "Spray at flowering and fruiting stages", "type": "Systemic Fungicide"},
            {"name": "Hexaconazole 5% EC", "dosage": "2 ml per liter of water", "application": "Spray at 15-day intervals during rainy season", "type": "Systemic Fungicide"},
            {"name": "Mancozeb 75% WP", "dosage": "2.5 grams per liter of water", "application": "Preventive spray before monsoon onset", "type": "Fungicide"}
        ]
    },
    "Maize healthy": {
        "severity": "None",
        "description": "The maize plant appears healthy with no visible signs of pest damage or disease. Leaves are green, upright, and show normal growth patterns. Continue regular monitoring to maintain plant health.",
        "symptoms": ["No symptoms detected — plant appears healthy"],
        "pesticides": []
    },
    "Tomato leaf blight": {
        "severity": "High",
        "description": "Tomato leaf blight can be caused by Phytophthora infestans (late blight) or Alternaria solani (early blight). These devastating diseases cause rapid leaf necrosis and can destroy entire crops within days under favorable conditions.",
        "symptoms": ["Water-soaked dark spots on leaves", "White fuzzy growth on leaf undersides (late blight)", "Concentric ring patterns on spots (early blight)", "Rapid browning and necrosis of foliage"],
        "pesticides": [
            {"name": "Metalaxyl + Mancozeb (Ridomil Gold)", "dosage": "2.5 grams per liter of water", "application": "Systemic treatment for active infections", "type": "Systemic Fungicide"},
            {"name": "Chlorothalonil 75% WP", "dosage": "2 grams per liter of water", "application": "Preventive spray every 7-10 days", "type": "Contact Fungicide"},
            {"name": "Azoxystrobin 23% SC", "dosage": "1 ml per liter of water", "application": "Spray at early disease stages", "type": "Strobilurin Fungicide"}
        ]
    },
    "Maize leaf blight": {
        "severity": "High",
        "description": "Maize leaf blight is primarily caused by Exserohilum turcicum (Northern Corn Leaf Blight). It produces large cigar-shaped lesions on leaves, significantly reducing photosynthesis and grain yield in severe cases.",
        "symptoms": ["Long elliptical gray-green to tan lesions", "Lesions 2-15 cm long along leaf veins", "Severe blighting of entire leaves", "Premature leaf senescence"],
        "pesticides": [
            {"name": "Propiconazole 25% EC", "dosage": "1 ml per liter of water", "application": "Spray at first sign of lesions", "type": "Systemic Fungicide"},
            {"name": "Mancozeb 75% WP", "dosage": "2.5 grams per liter of water", "application": "Preventive spray every 10 days", "type": "Contact Fungicide"},
            {"name": "Tebuconazole 25.9% EC", "dosage": "1 ml per liter of water", "application": "Foliar spray during tasseling stage", "type": "Triazole Fungicide"}
        ]
    },
    "Cassava green mite": {
        "severity": "Moderate",
        "description": "Cassava green mite (Mononychellus tanajoa) is a major pest that feeds on the underside of young leaves, causing chlorosis and reduced leaf area. Severe infestations in dry conditions can lead to significant yield losses.",
        "symptoms": ["Yellowish spots on upper leaf surface", "Tiny mites visible on leaf undersides", "Leaf distortion and reduced leaf size", "Premature leaf drop in severe cases"],
        "pesticides": [
            {"name": "Abamectin 1.8% EC", "dosage": "0.5 ml per liter of water", "application": "Spray on undersides of leaves", "type": "Acaricide"},
            {"name": "Dicofol 18.5% EC", "dosage": "2.5 ml per liter of water", "application": "Foliar spray every 14 days", "type": "Acaricide"},
            {"name": "Neem Oil 1500 ppm", "dosage": "5 ml per liter of water", "application": "Spray as organic alternative", "type": "Bio-pesticide"}
        ]
    },
    "Cashew healthy": {
        "severity": "None",
        "description": "The cashew plant appears healthy with no visible signs of pest damage or disease. Leaves are green and glossy with normal shape and size. Continue regular monitoring and good orchard management practices.",
        "symptoms": ["No symptoms detected — plant appears healthy"],
        "pesticides": []
    },
    "Cashew gumosis": {
        "severity": "High",
        "description": "Cashew gummosis is caused by the fungus Lasiodiplodia theobromae. It causes gum oozing from bark, cankers on stems and branches, and can lead to branch die-back and tree death if left untreated.",
        "symptoms": ["Gum exudation from trunk and branches", "Dark sunken cankers on bark", "Branch die-back", "Bark cracking and peeling"],
        "pesticides": [
            {"name": "Copper Oxychloride 50% WP", "dosage": "3 grams per liter of water", "application": "Paste on affected bark after scraping", "type": "Fungicide"},
            {"name": "Carbendazim 50% WP", "dosage": "1 gram per liter of water", "application": "Spray on cankers and surrounding area", "type": "Systemic Fungicide"},
            {"name": "Bordeaux Paste", "dosage": "10% concentration", "application": "Apply on wounds after pruning diseased branches", "type": "Wound Dressing"}
        ]
    },
    "Tomato healthy": {
        "severity": "None",
        "description": "The tomato plant appears healthy with no visible signs of pest damage or disease. Leaves are green with normal shape and good turgor. Continue regular monitoring, proper watering, and balanced fertilization.",
        "symptoms": ["No symptoms detected — plant appears healthy"],
        "pesticides": []
    },
    "Cassava brown spot": {
        "severity": "Moderate",
        "description": "Cassava brown spot is caused by the fungus Cercosporidium henningsii. It produces brown circular spots on mature leaves, leading to premature defoliation and reduced tuber yield in severe infections.",
        "symptoms": ["Brown circular spots on older leaves", "Spots with darker brown margins", "Yellowing around lesions", "Premature defoliation of lower leaves"],
        "pesticides": [
            {"name": "Mancozeb 75% WP", "dosage": "2.5 grams per liter of water", "application": "Foliar spray every 14 days", "type": "Fungicide"},
            {"name": "Copper Oxychloride 50% WP", "dosage": "3 grams per liter of water", "application": "Spray during wet season", "type": "Fungicide"},
            {"name": "Carbendazim 50% WP", "dosage": "1 gram per liter of water", "application": "Systemic spray at disease onset", "type": "Systemic Fungicide"}
        ]
    }
}

# ✅ MODEL
model = models.densenet121(weights=None)
model.classifier = nn.Linear(model.classifier.in_features, len(classes))

# ✅ LOAD MODEL
model.load_state_dict(torch.load("best_densenet_model.pth", map_location="cpu"))
model.eval()

# ✅ TRANSFORM
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor()
])

# ✅ API
@app.route('/predict', methods=['POST'])
def predict():
    file = request.files['file']
    img = Image.open(file).convert('RGB')
    img = transform(img).unsqueeze(0)

    with torch.no_grad():
        output = model(img)
        probabilities = torch.nn.functional.softmax(output, dim=1)
        confidence, pred = torch.max(probabilities, 1)

    prediction = classes[pred.item()]
    confidence_pct = round(confidence.item() * 100, 1)
    info = disease_info.get(prediction, {})
    return jsonify({
        "prediction": prediction,
        "confidence": confidence_pct,
        "severity": info.get("severity", ""),
        "description": info.get("description", ""),
        "symptoms": info.get("symptoms", []),
        "pesticides": info.get("pesticides", [])
    })

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)