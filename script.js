document.addEventListener("DOMContentLoaded", function () {
    const PANELSPOT = 0.555;
    const HSP = 4.73;

    // Función para calcular la producción de energía solar anual
    function SolarProduction(numPanels, PANELSPOT, HSP) {
        const daysonyear = 365;
        const factor = 0.85
        return Math.floor(numPanels * PANELSPOT * HSP * daysonyear * factor);
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
    
        // Si los paneles son 15 o menos, retorna solo el costo de un día de trabajo
        if (numPanels <= maxPanelsOneDay) {
            return costDayLabour;
        } else {
            // Para más de 15 paneles, incluye el factor de costo adicional por los días extra
            return costDayLabour + (workdays - 1) * (costDayLabour * factor);
        }
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

    function getAnnualSaving (UserConsum, kWcost) {
        savinganual = UserConsum*kWcost*12;
        return savinganual;
    }

    function getReturnTime(savinganual, estimatedinv) {
        const inflation = 0.12;
        const EIF = 0.15;
        const initialEfficiency = 0.978588098;
        const decayRate = 0.0114;
        let annualReturn = savinganual;
        let accsave = 0;
        let returntime = 0;
        while (accsave < estimatedinv) {
            returntime++;
            if (returntime > 1) {
                annualReturn *= (1 + EIF);
            }
            const efficiency = initialEfficiency * Math.pow(1 - decayRate, returntime - 1);
            const adjustedReturn = annualReturn * efficiency;
            accsave += adjustedReturn / Math.pow(1 + inflation, returntime);
        }
        return returntime;
    }

    function actualizarResultados() {
        const kWCost = parseFloat(document.getElementById("kW-cost").value);
        const UserConsum = parseFloat(document.getElementById("User-Consum").value);
        if (isNaN(kWCost) || isNaN(UserConsum)) {
            return;
        }

        const numPanels = GetnumPanels(UserConsum, PANELSPOT, HSP);
        const solarprod = SolarProduction(numPanels, PANELSPOT, HSP);
        const emissionsavo = EmissAvoided(solarprod, UserConsum);
        const savinganual = getAnnualSaving(UserConsum,kWCost);
        const estimatedinv = getEstimatedInvestment(numPanels);
        const invreturntime = getReturnTime(savinganual,estimatedinv);

        // Actualizar los elementos del DOM con los resultados
        document.getElementById("solarprod").innerHTML = `<p>Producción de energía solar anual: ${solarprod.toFixed(2)} kWh</p>`;
        document.getElementById("emissionsavo").innerHTML = `<p>Emisiones de CO2 evitadas: ${emissionsavo.toFixed(2)} kg</p>`;
        document.getElementById("estimatedinv").innerHTML = `<p>Inversión estimada: ${estimatedinv.toFixed(2)} COP</p>`;
        document.getElementById("Annualsaving").innerHTML = `<p>Ahorro anual estimado: ${savinganual.toFixed(2)} COP</p>`;
        document.getElementById("invreturntime").innerHTML = `<p>Tiempo máximo de retorno aprox de la inversión: ${invreturntime.toFixed(2)} años</p>`;
    }

    // Escuchar el evento input en los campos de entrada
    document.getElementById("kW-cost").addEventListener("input", actualizarResultados);
    document.getElementById("User-Consum").addEventListener("input", actualizarResultados);

    // Calculamos los resultados iniciales al cargar la página
    actualizarResultados();
});