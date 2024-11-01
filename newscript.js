document.addEventListener("DOMContentLoaded", function () {
    const PANELSPOT = 0.555;
    const HSP = 4.17;

    // Función para calcular la producción de energía solar anual
    function SolarProduction(PANELSPOT, HSP) {
        const daysonyear = 365;
        return PANELSPOT * HSP * daysonyear;
    }

    // Función para calcular las emisiones evitadas
    function EmissAvoided(solarprod, UserConsum) {
        const EmissionFact = 0.16438;
        return (solarprod - UserConsum) * EmissionFact;
    }

    // Función para calcular la cantidad de paneles necesarios
    function GetnumPanels(UserConsum, PANELSPOT, HSP) {
        let consperday = UserConsum / 30;
        return Math.ceil(consperday / (PANELSPOT * HSP));
    }

    // Costos relacionados con el sistema solar
    function getCostSolarPanels(numPanels) {
        const baseCost = 450000;
        return baseCost * numPanels;
    }

    function getMICost(numPanels) {
        const baseCost = 350000;
        return numPanels * baseCost;
    }

    function getStructureCost(numPanels) {
        const structureCost = 252212;
        return numPanels * structureCost;
    }

    function getTranspCost(numPanels) {
        const baseCost = 900000;
        let range = Math.ceil(numPanels / 10);
        return baseCost * range;
    }

    function getLabourCost(numPanels) {
        const maxPanelsOneDay = 15;
        const costDayLabour = 2300000;
        const factor = 0.5;
        let workdays = Math.ceil(numPanels / maxPanelsOneDay);
        return costDayLabour + workdays * (costDayLabour * factor);
    }

    function getDesingCost(numPanels) {
        const baseCost = 3000000;
        const factor = 0.5;
        let range = Math.ceil(numPanels / 10);
        return baseCost + range * (baseCost * factor);
    }

    // Función para calcular la inversión estimada
    function getEstimatedInvestment(numPanels) {
        const RETIE = 2000000;
        const EPMcollection = 3000000;
        const TAXexemption = 700000;
        const MeasurSysCost = 542000;
        const CountAdaptationCost = 700000;

        let costdesing = getDesingCost(numPanels);
        let costLabour = getLabourCost(numPanels);
        let costTransp = getTranspCost(numPanels);
        let costStructure = getStructureCost(numPanels);
        let micinvcost = getMICost(numPanels);
        let costpanels = getCostSolarPanels(numPanels);

        return (
            RETIE +
            EPMcollection +
            TAXexemption +
            MeasurSysCost +
            CountAdaptationCost +
            costdesing +
            costLabour +
            costTransp +
            costStructure +
            micinvcost +
            costpanels
        );
    }

    // Función para actualizar los resultados en pantalla
    function actualizarResultados() {
        const kWCost = parseFloat(document.getElementById("kW-cost").value);
        const UserConsum = parseFloat(document.getElementById("User-Consum").value);

        // Verificar si las entradas son válidas
        if (isNaN(kWCost) || isNaN(UserConsum)) {
            return;
        }

        const solarprod = SolarProduction(PANELSPOT, HSP);
        const emissionsavo = EmissAvoided(solarprod, UserConsum);
        const numPanels = GetnumPanels(UserConsum, PANELSPOT, HSP);
        const estimatedinv = getEstimatedInvestment(numPanels);
        const annualSaving = UserConsum * kWCost * 12;
        const invReturnTime = estimatedinv / annualSaving;

        // Actualizar los elementos del DOM con los resultados
        document.getElementById("solarprod").innerHTML = `<p>Producción de energía solar anual: ${solarprod.toFixed(2)} kWh</p>`;
        document.getElementById("emissionsavo").innerHTML = `<p>Emisiones de CO2 evitadas: ${emissionsavo.toFixed(2)} kg</p>`;
        document.getElementById("estimatedinv").innerHTML = `<p>Inversión estimada: ${estimatedinv.toFixed(2)} COP</p>`;
        document.getElementById("Annualsaving").innerHTML = `<p>Ahorro anual estimado: ${annualSaving.toFixed(2)} COP</p>`;
        document.getElementById("invreturntime").innerHTML = `<p>Tiempo de retorno de la inversión: ${invReturnTime.toFixed(2)} años</p>`;
    }

    // Escuchar el evento input en los campos de entrada
    document.getElementById("kW-cost").addEventListener("input", actualizarResultados);
    document.getElementById("User-Consum").addEventListener("input", actualizarResultados);

    // Calculamos los resultados iniciales al cargar la página
    actualizarResultados();
});
