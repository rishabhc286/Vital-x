// ================= HEALTHCARE FINDER LOGIC =================

// Curated Healthcare Data (Static for Prototype)
const healthcareData = {
    mumbai: {
        cardiology: [
            {
                name: "Dr. Ramesh Kumar",
                specialty: "Cardiologist",
                experience: 25,
                hospital: "Lilavati Hospital",
                city: "Mumbai",
                rating: 4.8
            },
            {
                name: "Dr. Priya Sharma",
                specialty: "Interventional Cardiologist",
                experience: 18,
                hospital: "Breach Candy Hospital",
                city: "Mumbai",
                rating: 4.7
            },
            {
                name: "Dr. Anil Mehta",
                specialty: "Cardiac Surgeon",
                experience: 22,
                hospital: "Kokilaben Dhirubhai Ambani Hospital",
                city: "Mumbai",
                rating: 4.9
            },
            {
                name: "Dr. Sneha Patel",
                specialty: "Pediatric Cardiologist",
                experience: 15,
                hospital: "Jaslok Hospital",
                city: "Mumbai",
                rating: 4.6
            },
            {
                name: "Dr. Vikram Singh",
                specialty: "Cardiologist",
                experience: 20,
                hospital: "Hinduja Hospital",
                city: "Mumbai",
                rating: 4.8
            }
        ],
        gynecology: [
            {
                name: "Dr. Anjali Desai",
                specialty: "Gynecologist & Obstetrician",
                experience: 20,
                hospital: "Breach Candy Hospital",
                city: "Mumbai",
                rating: 4.9
            },
            {
                name: "Dr. Meera Joshi",
                specialty: "Fertility Specialist",
                experience: 16,
                hospital: "Lilavati Hospital",
                city: "Mumbai",
                rating: 4.7
            },
            {
                name: "Dr. Kavita Rao",
                specialty: "Gynecologist",
                experience: 22,
                hospital: "Jaslok Hospital",
                city: "Mumbai",
                rating: 4.8
            },
            {
                name: "Dr. Sunita Verma",
                specialty: "High-Risk Pregnancy Specialist",
                experience: 18,
                hospital: "Hinduja Hospital",
                city: "Mumbai",
                rating: 4.6
            },
            {
                name: "Dr. Pooja Nair",
                specialty: "Gynecologist",
                experience: 14,
                hospital: "Kokilaben Hospital",
                city: "Mumbai",
                rating: 4.7
            }
        ],
        orthopedic: [
            {
                name: "Dr. Rajesh Gupta",
                specialty: "Orthopedic Surgeon",
                experience: 24,
                hospital: "Hinduja Hospital",
                city: "Mumbai",
                rating: 4.8
            },
            {
                name: "Dr. Amit Shah",
                specialty: "Joint Replacement Specialist",
                experience: 19,
                hospital: "Lilavati Hospital",
                city: "Mumbai",
                rating: 4.7
            },
            {
                name: "Dr. Suresh Reddy",
                specialty: "Spine Surgeon",
                experience: 21,
                hospital: "Kokilaben Hospital",
                city: "Mumbai",
                rating: 4.9
            },
            {
                name: "Dr. Manish Kulkarni",
                specialty: "Sports Medicine Specialist",
                experience: 15,
                hospital: "Breach Candy Hospital",
                city: "Mumbai",
                rating: 4.6
            },
            {
                name: "Dr. Deepak Jain",
                specialty: "Orthopedic Surgeon",
                experience: 17,
                hospital: "Jaslok Hospital",
                city: "Mumbai",
                rating: 4.7
            }
        ],
        neurology: [
            {
                name: "Dr. Ashok Patel",
                specialty: "Neurologist",
                experience: 26,
                hospital: "Jaslok Hospital",
                city: "Mumbai",
                rating: 4.9
            },
            {
                name: "Dr. Neha Kapoor",
                specialty: "Neurosurgeon",
                experience: 18,
                hospital: "Kokilaben Hospital",
                city: "Mumbai",
                rating: 4.8
            },
            {
                name: "Dr. Ravi Kumar",
                specialty: "Stroke Specialist",
                experience: 20,
                hospital: "Hinduja Hospital",
                city: "Mumbai",
                rating: 4.7
            },
            {
                name: "Dr. Sanjay Mehta",
                specialty: "Pediatric Neurologist",
                experience: 16,
                hospital: "Lilavati Hospital",
                city: "Mumbai",
                rating: 4.6
            },
            {
                name: "Dr. Priyanka Shah",
                specialty: "Neurologist",
                experience: 14,
                hospital: "Breach Candy Hospital",
                city: "Mumbai",
                rating: 4.7
            }
        ],
        dermatology: [
            {
                name: "Dr. Nisha Agarwal",
                specialty: "Dermatologist",
                experience: 17,
                hospital: "Breach Candy Hospital",
                city: "Mumbai",
                rating: 4.8
            },
            {
                name: "Dr. Kiran Deshmukh",
                specialty: "Cosmetic Dermatologist",
                experience: 14,
                hospital: "Lilavati Hospital",
                city: "Mumbai",
                rating: 4.7
            },
            {
                name: "Dr. Rahul Joshi",
                specialty: "Dermatologist",
                experience: 19,
                hospital: "Hinduja Hospital",
                city: "Mumbai",
                rating: 4.6
            },
            {
                name: "Dr. Swati Rao",
                specialty: "Pediatric Dermatologist",
                experience: 12,
                hospital: "Jaslok Hospital",
                city: "Mumbai",
                rating: 4.7
            },
            {
                name: "Dr. Varun Malhotra",
                specialty: "Dermatologist",
                experience: 16,
                hospital: "Kokilaben Hospital",
                city: "Mumbai",
                rating: 4.8
            }
        ],
        general: [
            {
                name: "Dr. Sunil Sharma",
                specialty: "General Physician",
                experience: 22,
                hospital: "Lilavati Hospital",
                city: "Mumbai",
                rating: 4.7
            },
            {
                name: "Dr. Rekha Iyer",
                specialty: "Family Medicine",
                experience: 18,
                hospital: "Hinduja Hospital",
                city: "Mumbai",
                rating: 4.6
            },
            {
                name: "Dr. Arun Nair",
                specialty: "General Physician",
                experience: 20,
                hospital: "Breach Candy Hospital",
                city: "Mumbai",
                rating: 4.7
            },
            {
                name: "Dr. Madhavi Kulkarni",
                specialty: "Internal Medicine",
                experience: 16,
                hospital: "Jaslok Hospital",
                city: "Mumbai",
                rating: 4.8
            },
            {
                name: "Dr. Prakash Reddy",
                specialty: "General Physician",
                experience: 19,
                hospital: "Kokilaben Hospital",
                city: "Mumbai",
                rating: 4.7
            }
        ],
        hospitals: [
            {
                name: "Lilavati Hospital and Research Centre",
                city: "Mumbai",
                type: "Multi-Specialty Private",
                departments: ["Cardiology", "Neurology", "Orthopedics", "Oncology"],
                rating: 4.8
            },
            {
                name: "Kokilaben Dhirubhai Ambani Hospital",
                city: "Mumbai",
                type: "Multi-Specialty Private",
                departments: ["Cardiac Sciences", "Neurosciences", "Oncology", "Orthopedics"],
                rating: 4.9
            },
            {
                name: "Hinduja Hospital",
                city: "Mumbai",
                type: "Multi-Specialty Private",
                departments: ["Cardiology", "Gastroenterology", "Nephrology", "Urology"],
                rating: 4.7
            },
            {
                name: "Breach Candy Hospital",
                city: "Mumbai",
                type: "Multi-Specialty Private",
                departments: ["Cardiology", "Gynecology", "Pediatrics", "Orthopedics"],
                rating: 4.6
            },
            {
                name: "Jaslok Hospital and Research Centre",
                city: "Mumbai",
                type: "Multi-Specialty Private",
                departments: ["Neurology", "Cardiology", "Oncology", "Gastroenterology"],
                rating: 4.7
            }
        ]
    },
    delhi: {
        cardiology: [
            {
                name: "Dr. Naresh Trehan",
                specialty: "Cardiac Surgeon",
                experience: 35,
                hospital: "Medanta - The Medicity",
                city: "Delhi",
                rating: 4.9
            },
            {
                name: "Dr. Ashok Seth",
                specialty: "Interventional Cardiologist",
                experience: 30,
                hospital: "Fortis Escorts Heart Institute",
                city: "Delhi",
                rating: 4.9
            },
            {
                name: "Dr. Praveen Chandra",
                specialty: "Cardiologist",
                experience: 28,
                hospital: "Medanta - The Medicity",
                city: "Delhi",
                rating: 4.8
            },
            {
                name: "Dr. Balbir Singh",
                specialty: "Electrophysiologist",
                experience: 26,
                hospital: "Max Super Specialty Hospital",
                city: "Delhi",
                rating: 4.8
            },
            {
                name: "Dr. Subhash Chandra",
                specialty: "Cardiologist",
                experience: 24,
                hospital: "BLK Super Specialty Hospital",
                city: "Delhi",
                rating: 4.7
            }
        ],
        gynecology: [
            {
                name: "Dr. Anita Sabherwal Anand",
                specialty: "Gynecologist & Obstetrician",
                experience: 25,
                hospital: "Sitaram Bhartia Institute",
                city: "Delhi",
                rating: 4.8
            },
            {
                name: "Dr. Ranjana Sharma",
                specialty: "Fertility Specialist",
                experience: 22,
                hospital: "Fortis La Femme",
                city: "Delhi",
                rating: 4.7
            },
            {
                name: "Dr. Shobha Gupta",
                specialty: "IVF Specialist",
                experience: 20,
                hospital: "Mother's Lap IVF Centre",
                city: "Delhi",
                rating: 4.9
            },
            {
                name: "Dr. Archana Dhawan Bajaj",
                specialty: "Gynecologist",
                experience: 18,
                hospital: "Apollo Hospital",
                city: "Delhi",
                rating: 4.6
            },
            {
                name: "Dr. Nandita Palshetkar",
                specialty: "IVF & Infertility Specialist",
                experience: 24,
                hospital: "Bloom IVF Centre",
                city: "Delhi",
                rating: 4.8
            }
        ],
        orthopedic: [
            {
                name: "Dr. Subhash Jangid",
                specialty: "Joint Replacement Surgeon",
                experience: 28,
                hospital: "Fortis Hospital",
                city: "Delhi",
                rating: 4.8
            },
            {
                name: "Dr. Raju Vaishya",
                specialty: "Orthopedic Surgeon",
                experience: 32,
                hospital: "Indraprastha Apollo Hospital",
                city: "Delhi",
                rating: 4.9
            },
            {
                name: "Dr. Vivek Lohia",
                specialty: "Spine Surgeon",
                experience: 20,
                hospital: "Max Super Specialty Hospital",
                city: "Delhi",
                rating: 4.7
            },
            {
                name: "Dr. Sanjay Gupta",
                specialty: "Orthopedic Surgeon",
                experience: 24,
                hospital: "BLK Super Specialty Hospital",
                city: "Delhi",
                rating: 4.6
            },
            {
                name: "Dr. Ashish Arbat",
                specialty: "Joint Replacement Specialist",
                experience: 22,
                hospital: "Medanta - The Medicity",
                city: "Delhi",
                rating: 4.8
            }
        ],
        hospitals: [
            {
                name: "Medanta - The Medicity",
                city: "Delhi",
                type: "Multi-Specialty Private",
                departments: ["Cardiac Sciences", "Neurosciences", "Oncology", "Orthopedics"],
                rating: 4.9
            },
            {
                name: "Fortis Escorts Heart Institute",
                city: "Delhi",
                type: "Cardiac Specialty",
                departments: ["Cardiology", "Cardiac Surgery", "Cardiac Anesthesia"],
                rating: 4.8
            },
            {
                name: "Indraprastha Apollo Hospital",
                city: "Delhi",
                type: "Multi-Specialty Private",
                departments: ["Cardiology", "Neurology", "Oncology", "Orthopedics"],
                rating: 4.8
            },
            {
                name: "Max Super Specialty Hospital",
                city: "Delhi",
                type: "Multi-Specialty Private",
                departments: ["Cardiology", "Neurology", "Oncology", "Gastroenterology"],
                rating: 4.7
            },
            {
                name: "BLK Super Specialty Hospital",
                city: "Delhi",
                type: "Multi-Specialty Private",
                departments: ["Cardiology", "Orthopedics", "Neurology", "Oncology"],
                rating: 4.7
            }
        ]
    },
    bangalore: {
        cardiology: [
            {
                name: "Dr. Devi Shetty",
                specialty: "Cardiac Surgeon",
                experience: 40,
                hospital: "Narayana Health City",
                city: "Bangalore",
                rating: 4.9
            },
            {
                name: "Dr. Viveka Kumar",
                specialty: "Interventional Cardiologist",
                experience: 22,
                hospital: "Fortis Hospital",
                city: "Bangalore",
                rating: 4.8
            },
            {
                name: "Dr. C N Manjunath",
                specialty: "Cardiologist",
                experience: 28,
                hospital: "Sri Jayadeva Institute",
                city: "Bangalore",
                rating: 4.7
            },
            {
                name: "Dr. Sathyaki Nambala",
                specialty: "Pediatric Cardiac Surgeon",
                experience: 18,
                hospital: "Narayana Health City",
                city: "Bangalore",
                rating: 4.8
            },
            {
                name: "Dr. Rajesh Vijayvergiya",
                specialty: "Cardiologist",
                experience: 20,
                hospital: "Manipal Hospital",
                city: "Bangalore",
                rating: 4.7
            }
        ],
        hospitals: [
            {
                name: "Narayana Health City",
                city: "Bangalore",
                type: "Multi-Specialty Private",
                departments: ["Cardiac Sciences", "Neurosciences", "Oncology", "Orthopedics"],
                rating: 4.9
            },
            {
                name: "Manipal Hospital",
                city: "Bangalore",
                type: "Multi-Specialty Private",
                departments: ["Cardiology", "Neurology", "Oncology", "Gastroenterology"],
                rating: 4.8
            },
            {
                name: "Fortis Hospital",
                city: "Bangalore",
                type: "Multi-Specialty Private",
                departments: ["Cardiology", "Orthopedics", "Neurology", "Oncology"],
                rating: 4.7
            },
            {
                name: "Apollo Hospital",
                city: "Bangalore",
                type: "Multi-Specialty Private",
                departments: ["Cardiology", "Neurology", "Oncology", "Orthopedics"],
                rating: 4.8
            },
            {
                name: "Columbia Asia Hospital",
                city: "Bangalore",
                type: "Multi-Specialty Private",
                departments: ["Cardiology", "Orthopedics", "Pediatrics", "Gynecology"],
                rating: 4.6
            }
        ]
    }
};

// Indian Cities for Auto-suggest
const indianCities = [
    "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai",
    "Kolkata", "Pune", "Ahmedabad", "Jaipur", "Surat",
    "Lucknow", "Kanpur", "Nagpur", "Indore", "Thane",
    "Bhopal", "Visakhapatnam", "Pimpri-Chinchwad", "Patna", "Vadodara"
];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    setupCityAutocomplete();
    checkAIRecommendation();
});

// City Autocomplete
function setupCityAutocomplete() {
    const cityInput = document.getElementById('cityInput');
    const suggestionsDiv = document.getElementById('citySuggestions');

    cityInput.addEventListener('input', (e) => {
        const value = e.target.value.toLowerCase().trim();

        if (value.length < 2) {
            suggestionsDiv.classList.remove('active');
            return;
        }

        const matches = indianCities.filter(city =>
            city.toLowerCase().includes(value)
        );

        if (matches.length > 0) {
            suggestionsDiv.innerHTML = matches.map(city =>
                `<div class="suggestion-item" onclick="selectCity('${city}')">${city}</div>`
            ).join('');
            suggestionsDiv.classList.add('active');
        } else {
            suggestionsDiv.classList.remove('active');
        }
    });

    // Close suggestions when clicking outside
    document.addEventListener('click', (e) => {
        if (!cityInput.contains(e.target) && !suggestionsDiv.contains(e.target)) {
            suggestionsDiv.classList.remove('active');
        }
    });
}

function selectCity(city) {
    document.getElementById('cityInput').value = city;
    document.getElementById('citySuggestions').classList.remove('active');
}

// Check if coming from AI Diagnosis
function checkAIRecommendation() {
    const urlParams = new URLSearchParams(window.location.search);
    const fromDiagnosis = urlParams.get('from') === 'diagnosis';

    if (fromDiagnosis) {
        document.getElementById('aiRecommendation').style.display = 'flex';
    }
}

// Search Healthcare
function searchHealthcare() {
    const city = document.getElementById('cityInput').value.trim().toLowerCase();
    const category = document.getElementById('categorySelect').value;

    if (!city || !category) {
        alert('⚠️ Please enter a city and select a medical category');
        return;
    }

    // Check if we have data for this city
    const cityData = healthcareData[city];

    if (!cityData) {
        showNoResults();
        return;
    }

    // Get doctors for the category
    const doctors = cityData[category] || [];
    const hospitals = cityData.hospitals || [];

    if (doctors.length === 0 && hospitals.length === 0) {
        showNoResults();
        return;
    }

    // Display results
    displayDoctors(doctors, category);
    displayHospitals(hospitals, city);

    // Show results section
    document.getElementById('emptyState').style.display = 'none';
    document.getElementById('noResults').style.display = 'none';
    document.getElementById('resultsSection').style.display = 'block';

    // Scroll to results
    document.getElementById('resultsSection').scrollIntoView({ behavior: 'smooth' });
}

// Display Doctors
function displayDoctors(doctors, category) {
    const grid = document.getElementById('doctorsGrid');
    const categoryText = document.getElementById('doctorCategory');

    const categoryNames = {
        cardiology: "Cardiology",
        gynecology: "Gynecology",
        orthopedic: "Orthopedics",
        neurology: "Neurology",
        dermatology: "Dermatology",
        general: "General Medicine",
        pediatrics: "Pediatrics",
        ophthalmology: "Ophthalmology",
        ent: "ENT",
        psychiatry: "Psychiatry"
    };

    categoryText.textContent = `Top-rated ${categoryNames[category] || category} specialists`;

    grid.innerHTML = doctors.map(doctor => `
        <div class="doctor-card">
            <div class="doctor-header">
                <div class="doctor-avatar">👨‍⚕️</div>
                <div class="doctor-info">
                    <h3>${doctor.name}</h3>
                    <div class="doctor-specialty">${doctor.specialty}</div>
                </div>
            </div>
            <div class="doctor-details">
                <div class="detail-item">
                    <span class="detail-icon">💼</span>
                    <span>${doctor.experience} years of experience</span>
                </div>
                <div class="detail-item">
                    <span class="detail-icon">🏥</span>
                    <span>${doctor.hospital}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-icon">📍</span>
                    <span>${doctor.city}</span>
                </div>
            </div>
            <div class="doctor-rating">
                <span class="stars">⭐⭐⭐⭐⭐</span>
                <span class="rating-text">${doctor.rating} / 5.0</span>
            </div>
        </div>
    `).join('');
}

// Display Hospitals
function displayHospitals(hospitals, city) {
    const grid = document.getElementById('hospitalsGrid');
    const cityText = document.getElementById('hospitalCity');

    cityText.textContent = `Well-known hospitals in ${city.charAt(0).toUpperCase() + city.slice(1)}`;

    grid.innerHTML = hospitals.map(hospital => `
        <div class="hospital-card">
            <div class="hospital-header">
                <div class="hospital-icon">🏥</div>
                <div class="hospital-type">${hospital.type}</div>
            </div>
            <div class="hospital-info">
                <h3>${hospital.name}</h3>
                <div class="hospital-location">
                    <span>📍</span>
                    <span>${hospital.city}</span>
                </div>
            </div>
            <div class="hospital-departments">
                <div class="departments-label">Key Departments</div>
                <div class="departments-list">
                    ${hospital.departments.map(dept =>
        `<span class="department-tag">${dept}</span>`
    ).join('')}
                </div>
            </div>
            <div class="doctor-rating">
                <span class="stars">⭐⭐⭐⭐⭐</span>
                <span class="rating-text">${hospital.rating} / 5.0</span>
            </div>
        </div>
    `).join('');
}

// Show No Results
function showNoResults() {
    document.getElementById('emptyState').style.display = 'none';
    document.getElementById('resultsSection').style.display = 'none';
    document.getElementById('noResults').style.display = 'block';
}
