// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract GestionnaireRisque {
    struct Contrepartie {
        address portefeuille; // Adresse de la contrepartie
        uint256 scoreCredit; // Score de crédit
        uint256 limiteExposition; // Limite d'exposition
        uint256 expositionCourante; // Exposition actuelle
        uint256 collaterale; // Garanties fournies
        bool estActif; // Statut actif ou inactif
    }

    mapping(address => Contrepartie) public contreparties;

    // Evenements
    event ContrepartieAjoutee(address indexed portefeuille, uint256 limiteExposition, uint256 collaterale);
    event ExpositionMiseAJour(address indexed portefeuille, uint256 nouvelleExposition);
    event TauxDeCouvertureInsuffisant(address indexed portefeuille, uint256 tauxDeCouverture);
    event CollateralMiseAJour(address indexed portefeuille, uint256 nouveauCollateral);
    event ContrepartieDesactivee(address indexed portefeuille);
    event ContrepartieReactivee(address indexed portefeuille);
    event ScoreCreditMiseAJour(address indexed portefeuille, uint256 nouveauScoreCredit); // Evénement pour mise à jour du score

    address public owner;

    constructor() {
        owner = msg.sender;
    }

    // Ajouter une nouvelle contrepartie
    function ajouterContrepartie(
        address _portefeuille, 
        uint256 _scoreCredit, 
        uint256 _limiteExposition, 
        uint256 _collateral
    ) public {
        require(contreparties[_portefeuille].estActif == false, "Contrepartie existe deja");
        require(_scoreCredit > 0 && _scoreCredit <= 850, "Score de credit invalide");
        require(_limiteExposition > 0, "La limite d'exposition doit etre superieure a zero");
        require(_collateral > 0, "Le collateral doit etre superieur a zero");

        contreparties[_portefeuille] = Contrepartie({
            portefeuille: _portefeuille,
            scoreCredit: _scoreCredit,
            limiteExposition: _limiteExposition,
            expositionCourante: 0,
            collaterale: _collateral,
            estActif: true
        });

        emit ContrepartieAjoutee(_portefeuille, _limiteExposition, _collateral);
    }

    // Mettre à jour le score de crédit d'une contrepartie
    function mettreAJourScoreCredit(address _portefeuille, uint256 _nouveauScoreCredit) public {
        require(contreparties[_portefeuille].estActif, "Contrepartie inactive");
        require(_nouveauScoreCredit > 0 && _nouveauScoreCredit <= 850, "Score de credit invalide");
        
        contreparties[_portefeuille].scoreCredit = _nouveauScoreCredit;
        emit ScoreCreditMiseAJour(_portefeuille, _nouveauScoreCredit);
    }

    // Mettre à jour l'exposition d'une contrepartie
    function mettreAJourExposition(address _portefeuille, uint256 _montant, bool ajouter) public {
        Contrepartie storage c = contreparties[_portefeuille];
        require(c.estActif, "Contrepartie inactive");
        require(_montant > 0, "Le montant doit etre superieur a zero");

        uint256 nouvelleExposition = c.expositionCourante;

        if (ajouter) {
            // Vérifier que le taux de couverture est suffisant avant l'ajout
            uint256 tauxCouverture = calculerTauxCouverture(_portefeuille);
            require(tauxCouverture >= 100, "Taux de couverture insuffisant");
            nouvelleExposition += _montant;
        } else {
            require(c.expositionCourante >= _montant, "Exposition insuffisante");
            nouvelleExposition -= _montant;
        }

        // Vérifier si la nouvelle exposition dépasse la limite
        require(nouvelleExposition <= c.limiteExposition, "Depassement de la limite d'exposition");

        // Mettre à jour l'exposition et émettre l'événement
        c.expositionCourante = nouvelleExposition;
        emit ExpositionMiseAJour(_portefeuille, c.expositionCourante);

        // Vérification du taux de couverture après modification
        if (calculerTauxCouverture(_portefeuille) < 100) {
            c.estActif = false;
            emit TauxDeCouvertureInsuffisant(_portefeuille, calculerTauxCouverture(_portefeuille));
            emit ContrepartieDesactivee(_portefeuille);
        }
    }

    // Mettre à jour le collateral d'une contrepartie
    function mettreAJourCollateral(address _portefeuille, uint256 _montant, bool ajouter) public {
        Contrepartie storage c = contreparties[_portefeuille];
        require(c.estActif, "Contrepartie inactive");
        require(_montant > 0, "Le montant doit etre superieur a zero");

        uint256 nouveauCollateral = c.collaterale;

        if (ajouter) {
            nouveauCollateral += _montant;
        } else {
            require(c.collaterale >= _montant, "Collateral insuffisant");
            nouveauCollateral -= _montant;
        }

        c.collaterale = nouveauCollateral;
        emit CollateralMiseAJour(_portefeuille, c.collaterale);

        // Vérifier le taux de couverture après mise à jour du collateral
        if (calculerTauxCouverture(_portefeuille) < 100) {
            emit TauxDeCouvertureInsuffisant(_portefeuille, calculerTauxCouverture(_portefeuille));
        }
    }

    // Calculer le taux de couverture
    function calculerTauxCouverture(address _portefeuille) public view returns (uint256) {
        Contrepartie storage c = contreparties[_portefeuille];
        require(c.expositionCourante > 0, "Impossible de calculer le taux de couverture");

        return (c.collaterale * 100) / c.expositionCourante;
    }

    // Désactiver une contrepartie
    function desactiverContrepartie(address _portefeuille) public {
        Contrepartie storage c = contreparties[_portefeuille];
        require(c.estActif, "Contrepartie deja inactive ou introuvable");

        c.estActif = false;
        emit ContrepartieDesactivee(_portefeuille);
    }

    // Réactiver une contrepartie après correction
    function reactiverContrepartie(address _portefeuille) public {
        Contrepartie storage c = contreparties[_portefeuille];
        require(c.estActif == false, "Contrepartie deja active");
        require(calculerTauxCouverture(_portefeuille) >= 100, "Taux de couverture toujours insuffisant");

        c.estActif = true;
        emit ContrepartieReactivee(_portefeuille);
    }
}
