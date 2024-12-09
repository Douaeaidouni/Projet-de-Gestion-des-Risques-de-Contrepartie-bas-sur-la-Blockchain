// Vérifier si l'utilisateur a Metamask installé
if (typeof window.ethereum !== 'undefined') {
    console.log('MetaMask is installed!');
} else {
    alert('Please install MetaMask!');
}

// Connecter Web3 à Metamask
const web3 = new Web3(window.ethereum);
let contract;
const contractAddress = '0x5b596f173621ca83c462ed32f33f51d93f7c265c';  // Remplacer par l'adresse de votre contrat déployé
const contractABI = [
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_portefeuille",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "_scoreCredit",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_limiteExposition",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_collateral",
                "type": "uint256"
            }
        ],
        "name": "ajouterContrepartie",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "portefeuille",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "nouveauCollateral",
                "type": "uint256"
            }
        ],
        "name": "CollateralMiseAJour",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "portefeuille",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "limiteExposition",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "collaterale",
                "type": "uint256"
            }
        ],
        "name": "ContrepartieAjoutee",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "portefeuille",
                "type": "address"
            }
        ],
        "name": "ContrepartieDesactivee",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "portefeuille",
                "type": "address"
            }
        ],
        "name": "ContrepartieReactivee",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_portefeuille",
                "type": "address"
            }
        ],
        "name": "desactiverContrepartie",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "portefeuille",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "nouvelleExposition",
                "type": "uint256"
            }
        ],
        "name": "ExpositionMiseAJour",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_portefeuille",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "_montant",
                "type": "uint256"
            },
            {
                "internalType": "bool",
                "name": "ajouter",
                "type": "bool"
            }
        ],
        "name": "mettreAJourCollateral",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_portefeuille",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "_montant",
                "type": "uint256"
            },
            {
                "internalType": "bool",
                "name": "ajouter",
                "type": "bool"
            }
        ],
        "name": "mettreAJourExposition",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_portefeuille",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "_nouveauScoreCredit",
                "type": "uint256"
            }
        ],
        "name": "mettreAJourScoreCredit",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_portefeuille",
                "type": "address"
            }
        ],
        "name": "reactiverContrepartie",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "portefeuille",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "nouveauScoreCredit",
                "type": "uint256"
            }
        ],
        "name": "ScoreCreditMiseAJour",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "portefeuille",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "tauxDeCouverture",
                "type": "uint256"
            }
        ],
        "name": "TauxDeCouvertureInsuffisant",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_portefeuille",
                "type": "address"
            }
        ],
        "name": "calculerTauxCouverture",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "contreparties",
        "outputs": [
            {
                "internalType": "address",
                "name": "portefeuille",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "scoreCredit",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "limiteExposition",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "expositionCourante",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "collaterale",
                "type": "uint256"
            },
            {
                "internalType": "bool",
                "name": "estActif",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "owner",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];

async function init() {
    // Demander la connexion avec le portefeuille Metamask
    await window.ethereum.request({ method: 'eth_requestAccounts' });

    contract = new web3.eth.Contract(contractABI, contractAddress);
    console.log('Contrat initialisé');
}

// Appeler init() pour initialiser la connexion au contrat
init();

// Ajouter une contrepartie avec validation des entrées
async function ajouterContrepartie() {
    const portefeuille = document.getElementById('portefeuille').value;
    const scoreCredit = document.getElementById('scoreCredit').value;
    const limiteExposition = document.getElementById('limiteExposition').value;
    const collateral = document.getElementById('collateral').value;

    // Validation des entrées
    if (!web3.utils.isAddress(portefeuille)) {
        alert('Erreur : L\'adresse du portefeuille est invalide!');
        return;
    }
    if (isNaN(scoreCredit) || scoreCredit <= 0) {
        alert('Erreur : Le score de crédit doit être un nombre positif!');
        return;
    }
    if (isNaN(limiteExposition) || limiteExposition <= 0) {
        alert('Erreur : La limite d\'exposition doit être un nombre positif!');
        return;
    }
    if (isNaN(collateral) || collateral <= 0) {
        alert('Erreur : Le collatéral doit être un nombre positif!');
        return;
    }

    const accounts = await web3.eth.getAccounts();
    const owner = accounts[0];  // Utiliser le compte connecté

    await contract.methods.ajouterContrepartie(portefeuille, scoreCredit, limiteExposition, collateral)
        .send({ from: owner })
        .on('receipt', function (receipt) {
            alert('Contrepartie ajoutée avec succès!');
        })
        .on('error', function (error) {
            alert('Erreur: ' + error.message);
        });
}

// Mettre à jour l'exposition avec validation
async function mettreAJourExposition(ajouter) {
    const portefeuille = document.getElementById('portefeuilleExposition').value;
    const montant = document.getElementById('montantExposition').value;

    // Validation des entrées
    if (!web3.utils.isAddress(portefeuille)) {
        alert('Erreur : L\'adresse du portefeuille est invalide!');
        return;
    }
    if (isNaN(montant) || montant <= 0) {
        alert('Erreur : Le montant d\'exposition doit être un nombre positif!');
        return;
    }

    const accounts = await web3.eth.getAccounts();
    const owner = accounts[0];

    await contract.methods.mettreAJourExposition(portefeuille, montant, ajouter)
        .send({ from: owner })
        .on('receipt', function (receipt) {
            alert('Exposition mise à jour avec succès!');
        })
        .on('error', function (error) {
            alert('Erreur: ' + error.message);
        });
}

// Mettre à jour le collatéral avec validation
async function mettreAJourCollateral(ajouter) {
    const portefeuille = document.getElementById('portefeuilleCollateral').value;
    const montant = document.getElementById('montantCollateral').value;

    // Validation des entrées
    if (!web3.utils.isAddress(portefeuille)) {
        alert('Erreur : L\'adresse du portefeuille est invalide!');
        return;
    }
    if (isNaN(montant) || montant <= 0) {
        alert('Erreur : Le montant du collatéral doit être un nombre positif!');
        return;
    }

    const accounts = await web3.eth.getAccounts();
    const owner = accounts[0];

    await contract.methods.mettreAJourCollateral(portefeuille, montant, ajouter)
        .send({ from: owner })
        .on('receipt', function (receipt) {
            alert('Collatéral mis à jour avec succès!');
        })
        .on('error', function (error) {
            alert('Erreur: ' + error.message);
        });
}

// Mettre à jour le score de crédit avec validation
async function mettreAJourScoreCredit() {
    const portefeuille = document.getElementById('portefeuilleScore').value;
    const nouveauScoreCredit = document.getElementById('nouveauScoreCredit').value;

    // Validation des entrées
    if (!web3.utils.isAddress(portefeuille)) {
        alert('Erreur : L\'adresse du portefeuille est invalide!');
        return;
    }
    if (isNaN(nouveauScoreCredit) || nouveauScoreCredit <= 0) {
        alert('Erreur : Le nouveau score de crédit doit être un nombre positif!');
        return;
    }

    const accounts = await web3.eth.getAccounts();
    const owner = accounts[0];

    await contract.methods.mettreAJourScoreCredit(portefeuille, nouveauScoreCredit)
        .send({ from: owner })
        .on('receipt', function (receipt) {
            alert('Score de crédit mis à jour avec succès!');
        })
        .on('error', function (error) {
            alert('Erreur: ' + error.message);
        });
}

// Désactiver une contrepartie
async function desactiverContrepartie() {
    const portefeuille = document.getElementById('portefeuilleExposition').value;

    // Validation de l'adresse
    if (!web3.utils.isAddress(portefeuille)) {
        alert('Erreur : L\'adresse du portefeuille est invalide!');
        return;
    }

    const accounts = await web3.eth.getAccounts();
    const owner = accounts[0];

    await contract.methods.desactiverContrepartie(portefeuille)
        .send({ from: owner })
        .on('receipt', function (receipt) {
            alert('Contrepartie désactivée avec succès!');
        })
        .on('error', function (error) {
            alert('Erreur: ' + error.message);
        });
}

// Réactiver une contrepartie
async function reactiverContrepartie() {
    const portefeuille = document.getElementById('portefeuilleExposition').value;

    // Validation de l'adresse
    if (!web3.utils.isAddress(portefeuille)) {
        alert('Erreur : L\'adresse du portefeuille est invalide!');
        return;
    }

    const accounts = await web3.eth.getAccounts();
    const owner = accounts[0];

    await contract.methods.reactiverContrepartie(portefeuille)
        .send({ from: owner })
        .on('receipt', function (receipt) {
            alert('Contrepartie réactivée avec succès!');
        })
        .on('error', function (error) {
            alert('Erreur: ' + error.message);
        });
}

// Calculer le taux de couverture
async function calculerTauxCouverture() {
    const portefeuille = document.getElementById('portefeuilleTaux').value;

    // Validation de l'adresse
    if (!web3.utils.isAddress(portefeuille)) {
        alert('Erreur : L\'adresse du portefeuille est invalide!');
        return;
    }

    const taux = await contract.methods.calculerTauxCouverture(portefeuille).call();
    document.getElementById('tauxCouvertureResult').innerText = `Taux de couverture: ${taux}%`;
}
