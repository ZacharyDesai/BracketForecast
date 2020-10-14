// change every year
const teamA = `Michigan State`;
const teamB = `Virginia`;
const teamC = `Auburn`;
const teamD = `Texas Tech`;
const oddsAD = .54;
const oddsBC = .73;
const oddsAB = .40;
const oddsAC = .67;
const oddsDB = .40;
const oddsDC = .65;

const scenarioAB = oddsAD * oddsBC * oddsAB;
const scenarioBA = oddsAD * oddsBC * (1.0 - oddsAB);
const scenarioAC = oddsAD * (1.0 - oddsBC) * oddsAC;
const scenarioCA = oddsAD * (1.0 - oddsBC) * (1.0 - oddsAC);
const scenarioDB = (1.0 - oddsAD) * oddsBC * oddsDB;
const scenarioBD = (1.0 - oddsAD) * oddsBC * (1.0 - oddsDB);
const scenarioDC = (1.0 - oddsAD) * (1.0 - oddsBC) * oddsDC;
const scenarioCD = (1.0 - oddsAD) * (1.0 - oddsBC) * (1.0 - oddsDC);

const scenarios = [["AB", scenarioAB], ["BA", scenarioBA], ["AC", scenarioAC], ["CA", scenarioCA], ["DB", scenarioDB], ["BD", scenarioBD], ["DC", scenarioDC], ["CD", scenarioCD]];
scenarios.sort(function(a, b) {
	return b[1] - a[1];
});

const entryIdx = [2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 24, 26, 28, 30, 32, 34, 36, 38, 40, 42, 44, 46, 48, 50, 52];
const pointIdx = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 23, 25, 27, 29, 31, 33, 35, 37, 39, 41, 43, 45, 47, 49, 51];

$w.onReady(function () {

	$w("#submitbutton").onClick(function () {
		const ptsFinalFour = parseInt($w("#input21").value, 10);
		const ptsChampion = parseInt($w("#input22").value, 10);
		if (isNaN(ptsFinalFour) || isNaN(ptsChampion)) {
			return;
		}
		let entries = [];
		let championProbabilities = [];
		let cochampionProbabilities = [];
		for (let i = 1; i <= 25; i++) {
			const entryName = $w(`#input${entryIdx[i - 1]}`).value;
			const pts = parseInt($w(`#input${pointIdx[i - 1]}`).value, 10);
			const pick1 = $w(`#dropdown${i * 3}`).value;
			const pick2 = $w(`#dropdown${i * 3 - 1}`).value;
			const pick3 = $w(`#dropdown${i * 3 - 2}`).value;
			if (entryName !== "" && pts !== "" && pick1 !== "" && pick2 !== "" && pick3 !== "") {
				entries.push([entryName, pts, pick1, pick2, pick3]);
			}
			championProbabilities[entryName] = 0.0;
			cochampionProbabilities[entryName] = 0.0;
		}
		if (entries.length === 0) {
			return;
		}
		let tieProbability = 0.0;
		for (let i = 0; i < scenarios.length; i++) {
			let scenarioEntries = [];
			const scenario = scenarios[i][0];
			const scenario1 = scenario[0];
			const scenario2 = scenario[1];
			let pick1;
			let pick2;
			let pick3;
			let pick4;
			if (scenario1 === 'A' || scenario1 === 'D') {
				if (scenario1 === 'A') {
					pick1 = teamA;
					pick3 = teamA;
				}
				else {
					pick1 = teamD;
					pick3 = teamD;
				}
				if (scenario2 === 'B') {
					pick2 = teamB;
					pick4 = teamB;
				}
				else {
					pick2 = teamC;
					pick4 = teamC;
				}
			}
			else {
				if (scenario1 === 'B') {
					pick2 = teamB;
					pick3 = teamB;
				}
				else {
					pick2 = teamC;
					pick3 = teamC;
				}
				if (scenario2 === 'A') {
					pick1 = teamA;
					pick4 = teamA;
				}
				else {
					pick1 = teamD;
					pick4 = teamD;
				}
			}
			const probability = scenarios[i][1];
			for (let j = 0; j < entries.length; j++) {
				const entryName = entries[j][0];
				let pts = entries[j][1];
				const entryPick1 = entries[j][2];
				const entryPick2 = entries[j][3];
				const entryPick3 = entries[j][4];
				if (entryPick1 === pick1) {
					pts += ptsFinalFour;
				}
				if (entryPick2 === pick2) {
					pts += ptsFinalFour;
				}
				if (entryPick3 === pick3) {
					pts += ptsChampion;
				}
				scenarioEntries.push([entryName, pts]);
			}
			scenarioEntries.sort(function (a, b) {
				return b[1] - a[1];
			});
			if (scenarioEntries.length === 1 || scenarioEntries[0][1] > scenarioEntries[1][1]) {
				championProbabilities[scenarioEntries[0][0]] += probability;
				cochampionProbabilities[scenarioEntries[0][0]] += probability;
			}
			else {
				tieProbability += probability;
				for (let j = 0; j < scenarioEntries.length && scenarioEntries[j][1] === scenarioEntries[0][1]; j++) {
					cochampionProbabilities[scenarioEntries[j][0]] += probability;
				}
			}
			$w(`#scenario${i + 1}title`).text = `Scenario ${i + 1}: ${pick3} over ${pick4} (${Math.round(probability * 1000) / 10}%)`;
			let str = ``;
			for (let j = 0; j < scenarioEntries.length; j++) {
				const scenarioEntry = scenarioEntries[j];
				str += `${j + 1}. ${scenarioEntry[0]} (${scenarioEntry[1]} PTS)\n`;
			}
			str += `\n\n\n`;
			$w(`#scenario${i + 1}text`).text = str;
		}
		let championChances = [];
		let cochampionChances = [];
		for (let i = 0; i < entries.length; i++) {
			championChances.push([entries[i][0], championProbabilities[entries[i][0]]]);
			cochampionChances.push([entries[i][0], cochampionProbabilities[entries[i][0]]]);
		}
		championChances.push(["[tie]", tieProbability]);
		championChances.sort(function (a, b) {
			return b[1] - a[1];
		});
		cochampionChances.sort(function (a, b) {
			return b[1] - a[1];
		});
		let championStr = ``;
		for (let i = 0; i < championChances.length; i++) {
			const championChance = championChances[i];
			championStr += `${i + 1}. ${championChance[0]} (${Math.round(championChance[1] * 1000) / 10}%)\n`;
		}
		$w(`#championtext`).text = championStr;
		let cochampionStr = ``;
		for (let i = 0; i < cochampionChances.length; i++) {
			const cochampionChance = cochampionChances[i];
			cochampionStr += `${i + 1}. ${cochampionChance[0]} (${Math.round(cochampionChance[1] * 1000) / 10}%)\n`;
		}
		$w(`#cochampiontext`).text = cochampionStr;
		$w(`#outputsection`).expand();
		for (let i = 1; i <= 8; i++) {
			$w(`#scenario${i}section`).expand();
		}
		$w(`#scenariospacer`).expand();
	});

	$w("#dropdown3").options = [{"label": "[none]", "value": "[none]"}, {"label": teamA, "value": teamA}, {"label": teamD, "value": teamD}];
	$w("#dropdown2").options = [{"label": "[none]", "value": "[none]"}, {"label": teamB, "value": teamB}, {"label": teamC, "value": teamC}];
	$w("#dropdown6").options = [{"label": "[none]", "value": "[none]"}, {"label": teamA, "value": teamA}, {"label": teamD, "value": teamD}];
	$w("#dropdown5").options = [{"label": "[none]", "value": "[none]"}, {"label": teamB, "value": teamB}, {"label": teamC, "value": teamC}];
	$w("#dropdown9").options = [{"label": "[none]", "value": "[none]"}, {"label": teamA, "value": teamA}, {"label": teamD, "value": teamD}];
	$w("#dropdown8").options = [{"label": "[none]", "value": "[none]"}, {"label": teamB, "value": teamB}, {"label": teamC, "value": teamC}];
	$w("#dropdown12").options = [{"label": "[none]", "value": "[none]"}, {"label": teamA, "value": teamA}, {"label": teamD, "value": teamD}];
	$w("#dropdown11").options = [{"label": "[none]", "value": "[none]"}, {"label": teamB, "value": teamB}, {"label": teamC, "value": teamC}];
	$w("#dropdown15").options = [{"label": "[none]", "value": "[none]"}, {"label": teamA, "value": teamA}, {"label": teamD, "value": teamD}];
	$w("#dropdown14").options = [{"label": "[none]", "value": "[none]"}, {"label": teamB, "value": teamB}, {"label": teamC, "value": teamC}];
	$w("#dropdown18").options = [{"label": "[none]", "value": "[none]"}, {"label": teamA, "value": teamA}, {"label": teamD, "value": teamD}];
	$w("#dropdown17").options = [{"label": "[none]", "value": "[none]"}, {"label": teamB, "value": teamB}, {"label": teamC, "value": teamC}];
	$w("#dropdown21").options = [{"label": "[none]", "value": "[none]"}, {"label": teamA, "value": teamA}, {"label": teamD, "value": teamD}];
	$w("#dropdown20").options = [{"label": "[none]", "value": "[none]"}, {"label": teamB, "value": teamB}, {"label": teamC, "value": teamC}];
	$w("#dropdown24").options = [{"label": "[none]", "value": "[none]"}, {"label": teamA, "value": teamA}, {"label": teamD, "value": teamD}];
	$w("#dropdown23").options = [{"label": "[none]", "value": "[none]"}, {"label": teamB, "value": teamB}, {"label": teamC, "value": teamC}];
	$w("#dropdown27").options = [{"label": "[none]", "value": "[none]"}, {"label": teamA, "value": teamA}, {"label": teamD, "value": teamD}];
	$w("#dropdown26").options = [{"label": "[none]", "value": "[none]"}, {"label": teamB, "value": teamB}, {"label": teamC, "value": teamC}];
	$w("#dropdown30").options = [{"label": "[none]", "value": "[none]"}, {"label": teamA, "value": teamA}, {"label": teamD, "value": teamD}];
	$w("#dropdown29").options = [{"label": "[none]", "value": "[none]"}, {"label": teamB, "value": teamB}, {"label": teamC, "value": teamC}];
	$w("#dropdown33").options = [{"label": "[none]", "value": "[none]"}, {"label": teamA, "value": teamA}, {"label": teamD, "value": teamD}];
	$w("#dropdown32").options = [{"label": "[none]", "value": "[none]"}, {"label": teamB, "value": teamB}, {"label": teamC, "value": teamC}];
	$w("#dropdown36").options = [{"label": "[none]", "value": "[none]"}, {"label": teamA, "value": teamA}, {"label": teamD, "value": teamD}];
	$w("#dropdown35").options = [{"label": "[none]", "value": "[none]"}, {"label": teamB, "value": teamB}, {"label": teamC, "value": teamC}];
	$w("#dropdown39").options = [{"label": "[none]", "value": "[none]"}, {"label": teamA, "value": teamA}, {"label": teamD, "value": teamD}];
	$w("#dropdown38").options = [{"label": "[none]", "value": "[none]"}, {"label": teamB, "value": teamB}, {"label": teamC, "value": teamC}];
	$w("#dropdown42").options = [{"label": "[none]", "value": "[none]"}, {"label": teamA, "value": teamA}, {"label": teamD, "value": teamD}];
	$w("#dropdown41").options = [{"label": "[none]", "value": "[none]"}, {"label": teamB, "value": teamB}, {"label": teamC, "value": teamC}];
	$w("#dropdown45").options = [{"label": "[none]", "value": "[none]"}, {"label": teamA, "value": teamA}, {"label": teamD, "value": teamD}];
	$w("#dropdown44").options = [{"label": "[none]", "value": "[none]"}, {"label": teamB, "value": teamB}, {"label": teamC, "value": teamC}];
	$w("#dropdown48").options = [{"label": "[none]", "value": "[none]"}, {"label": teamA, "value": teamA}, {"label": teamD, "value": teamD}];
	$w("#dropdown47").options = [{"label": "[none]", "value": "[none]"}, {"label": teamB, "value": teamB}, {"label": teamC, "value": teamC}];
	$w("#dropdown51").options = [{"label": "[none]", "value": "[none]"}, {"label": teamA, "value": teamA}, {"label": teamD, "value": teamD}];
	$w("#dropdown50").options = [{"label": "[none]", "value": "[none]"}, {"label": teamB, "value": teamB}, {"label": teamC, "value": teamC}];
	$w("#dropdown54").options = [{"label": "[none]", "value": "[none]"}, {"label": teamA, "value": teamA}, {"label": teamD, "value": teamD}];
	$w("#dropdown53").options = [{"label": "[none]", "value": "[none]"}, {"label": teamB, "value": teamB}, {"label": teamC, "value": teamC}];
	$w("#dropdown57").options = [{"label": "[none]", "value": "[none]"}, {"label": teamA, "value": teamA}, {"label": teamD, "value": teamD}];
	$w("#dropdown56").options = [{"label": "[none]", "value": "[none]"}, {"label": teamB, "value": teamB}, {"label": teamC, "value": teamC}];
	$w("#dropdown60").options = [{"label": "[none]", "value": "[none]"}, {"label": teamA, "value": teamA}, {"label": teamD, "value": teamD}];
	$w("#dropdown59").options = [{"label": "[none]", "value": "[none]"}, {"label": teamB, "value": teamB}, {"label": teamC, "value": teamC}];
	$w("#dropdown63").options = [{"label": "[none]", "value": "[none]"}, {"label": teamA, "value": teamA}, {"label": teamD, "value": teamD}];
	$w("#dropdown62").options = [{"label": "[none]", "value": "[none]"}, {"label": teamB, "value": teamB}, {"label": teamC, "value": teamC}];
	$w("#dropdown66").options = [{"label": "[none]", "value": "[none]"}, {"label": teamA, "value": teamA}, {"label": teamD, "value": teamD}];
	$w("#dropdown65").options = [{"label": "[none]", "value": "[none]"}, {"label": teamB, "value": teamB}, {"label": teamC, "value": teamC}];
	$w("#dropdown69").options = [{"label": "[none]", "value": "[none]"}, {"label": teamA, "value": teamA}, {"label": teamD, "value": teamD}];
	$w("#dropdown68").options = [{"label": "[none]", "value": "[none]"}, {"label": teamB, "value": teamB}, {"label": teamC, "value": teamC}];
	$w("#dropdown72").options = [{"label": "[none]", "value": "[none]"}, {"label": teamA, "value": teamA}, {"label": teamD, "value": teamD}];
	$w("#dropdown71").options = [{"label": "[none]", "value": "[none]"}, {"label": teamB, "value": teamB}, {"label": teamC, "value": teamC}];
	$w("#dropdown75").options = [{"label": "[none]", "value": "[none]"}, {"label": teamA, "value": teamA}, {"label": teamD, "value": teamD}];
	$w("#dropdown74").options = [{"label": "[none]", "value": "[none]"}, {"label": teamB, "value": teamB}, {"label": teamC, "value": teamC}];

	$w("#dropdown3").onChange((event) => {
		let options = [{"label": "[none]", "value": "[none]"}];
		const val1 = $w("#dropdown3").value;
		const val2 = $w("#dropdown2").value;
		if (val1 !== "[none]" && val1 !== "") {
			options.push({"label": val1, "value": val1});
		}
		if (val2 !== "[none]" && val2 !== "") {
			options.push({"label": val2, "value": val2});
		}
		$w("#dropdown1").options = options;
		$w("#dropdown1").value = "[none]";
	});
	$w("#dropdown2").onChange((event) => {
		let options = [{"label": "[none]", "value": "[none]"}];
		const val1 = $w("#dropdown3").value;
		const val2 = $w("#dropdown2").value;
		if (val1 !== "[none]" && val1 !== "") {
			options.push({"label": val1, "value": val1});
		}
		if (val2 !== "[none]" && val2 !== "") {
			options.push({"label": val2, "value": val2});
		}
		$w("#dropdown1").options = options;
		$w("#dropdown1").value = "[none]";
	});

	$w("#dropdown6").onChange((event) => {
		let options = [{"label": "[none]", "value": "[none]"}];
		const val1 = $w("#dropdown6").value;
		const val2 = $w("#dropdown5").value;
		if (val1 !== "[none]" && val1 !== "") {
			options.push({"label": val1, "value": val1});
		}
		if (val2 !== "[none]" && val2 !== "") {
			options.push({"label": val2, "value": val2});
		}
		$w("#dropdown4").options = options;
		$w("#dropdown4").value = "[none]";
	});
	$w("#dropdown5").onChange((event) => {
		let options = [{"label": "[none]", "value": "[none]"}];
		const val1 = $w("#dropdown6").value;
		const val2 = $w("#dropdown5").value;
		if (val1 !== "[none]" && val1 !== "") {
			options.push({"label": val1, "value": val1});
		}
		if (val2 !== "[none]" && val2 !== "") {
			options.push({"label": val2, "value": val2});
		}
		$w("#dropdown4").options = options;
		$w("#dropdown4").value = "[none]";
	});

	$w("#dropdown9").onChange((event) => {
		let options = [{"label": "[none]", "value": "[none]"}];
		const val1 = $w("#dropdown9").value;
		const val2 = $w("#dropdown8").value;
		if (val1 !== "[none]" && val1 !== "") {
			options.push({"label": val1, "value": val1});
		}
		if (val2 !== "[none]" && val2 !== "") {
			options.push({"label": val2, "value": val2});
		}
		$w("#dropdown7").options = options;
		$w("#dropdown7").value = "[none]";
	});
	$w("#dropdown8").onChange((event) => {
		let options = [{"label": "[none]", "value": "[none]"}];
		const val1 = $w("#dropdown9").value;
		const val2 = $w("#dropdown8").value;
		if (val1 !== "[none]" && val1 !== "") {
			options.push({"label": val1, "value": val1});
		}
		if (val2 !== "[none]" && val2 !== "") {
			options.push({"label": val2, "value": val2});
		}
		$w("#dropdown7").options = options;
		$w("#dropdown7").value = "[none]";
	});

	$w("#dropdown12").onChange((event) => {
		let options = [{"label": "[none]", "value": "[none]"}];
		const val1 = $w("#dropdown12").value;
		const val2 = $w("#dropdown11").value;
		if (val1 !== "[none]" && val1 !== "") {
			options.push({"label": val1, "value": val1});
		}
		if (val2 !== "[none]" && val2 !== "") {
			options.push({"label": val2, "value": val2});
		}
		$w("#dropdown10").options = options;
		$w("#dropdown10").value = "[none]";
	});
	$w("#dropdown11").onChange((event) => {
		let options = [{"label": "[none]", "value": "[none]"}];
		const val1 = $w("#dropdown12").value;
		const val2 = $w("#dropdown11").value;
		if (val1 !== "[none]" && val1 !== "") {
			options.push({"label": val1, "value": val1});
		}
		if (val2 !== "[none]" && val2 !== "") {
			options.push({"label": val2, "value": val2});
		}
		$w("#dropdown10").options = options;
		$w("#dropdown10").value = "[none]";
	});

	$w("#dropdown15").onChange((event) => {
		let options = [{"label": "[none]", "value": "[none]"}];
		const val1 = $w("#dropdown15").value;
		const val2 = $w("#dropdown14").value;
		if (val1 !== "[none]" && val1 !== "") {
			options.push({"label": val1, "value": val1});
		}
		if (val2 !== "[none]" && val2 !== "") {
			options.push({"label": val2, "value": val2});
		}
		$w("#dropdown13").options = options;
		$w("#dropdown13").value = "[none]";
	});
	$w("#dropdown14").onChange((event) => {
		let options = [{"label": "[none]", "value": "[none]"}];
		const val1 = $w("#dropdown15").value;
		const val2 = $w("#dropdown14").value;
		if (val1 !== "[none]" && val1 !== "") {
			options.push({"label": val1, "value": val1});
		}
		if (val2 !== "[none]" && val2 !== "") {
			options.push({"label": val2, "value": val2});
		}
		$w("#dropdown13").options = options;
		$w("#dropdown13").value = "[none]";
	});

	$w("#dropdown18").onChange((event) => {
		let options = [{"label": "[none]", "value": "[none]"}];
		const val1 = $w("#dropdown18").value;
		const val2 = $w("#dropdown17").value;
		if (val1 !== "[none]" && val1 !== "") {
			options.push({"label": val1, "value": val1});
		}
		if (val2 !== "[none]" && val2 !== "") {
			options.push({"label": val2, "value": val2});
		}
		$w("#dropdown16").options = options;
		$w("#dropdown16").value = "[none]";
	});
	$w("#dropdown17").onChange((event) => {
		let options = [{"label": "[none]", "value": "[none]"}];
		const val1 = $w("#dropdown18").value;
		const val2 = $w("#dropdown17").value;
		if (val1 !== "[none]" && val1 !== "") {
			options.push({"label": val1, "value": val1});
		}
		if (val2 !== "[none]" && val2 !== "") {
			options.push({"label": val2, "value": val2});
		}
		$w("#dropdown16").options = options;
		$w("#dropdown16").value = "[none]";
	});

	$w("#dropdown21").onChange((event) => {
		let options = [{"label": "[none]", "value": "[none]"}];
		const val1 = $w("#dropdown21").value;
		const val2 = $w("#dropdown20").value;
		if (val1 !== "[none]" && val1 !== "") {
			options.push({"label": val1, "value": val1});
		}
		if (val2 !== "[none]" && val2 !== "") {
			options.push({"label": val2, "value": val2});
		}
		$w("#dropdown19").options = options;
		$w("#dropdown19").value = "[none]";
	});
	$w("#dropdown20").onChange((event) => {
		let options = [{"label": "[none]", "value": "[none]"}];
		const val1 = $w("#dropdown21").value;
		const val2 = $w("#dropdown20").value;
		if (val1 !== "[none]" && val1 !== "") {
			options.push({"label": val1, "value": val1});
		}
		if (val2 !== "[none]" && val2 !== "") {
			options.push({"label": val2, "value": val2});
		}
		$w("#dropdown19").options = options;
		$w("#dropdown19").value = "[none]";
	});

	$w("#dropdown24").onChange((event) => {
		let options = [{"label": "[none]", "value": "[none]"}];
		const val1 = $w("#dropdown24").value;
		const val2 = $w("#dropdown23").value;
		if (val1 !== "[none]" && val1 !== "") {
			options.push({"label": val1, "value": val1});
		}
		if (val2 !== "[none]" && val2 !== "") {
			options.push({"label": val2, "value": val2});
		}
		$w("#dropdown22").options = options;
		$w("#dropdown22").value = "[none]";
	});
	$w("#dropdown23").onChange((event) => {
		let options = [{"label": "[none]", "value": "[none]"}];
		const val1 = $w("#dropdown24").value;
		const val2 = $w("#dropdown23").value;
		if (val1 !== "[none]" && val1 !== "") {
			options.push({"label": val1, "value": val1});
		}
		if (val2 !== "[none]" && val2 !== "") {
			options.push({"label": val2, "value": val2});
		}
		$w("#dropdown22").options = options;
		$w("#dropdown22").value = "[none]";
	});

	$w("#dropdown27").onChange((event) => {
		let options = [{"label": "[none]", "value": "[none]"}];
		const val1 = $w("#dropdown27").value;
		const val2 = $w("#dropdown26").value;
		if (val1 !== "[none]" && val1 !== "") {
			options.push({"label": val1, "value": val1});
		}
		if (val2 !== "[none]" && val2 !== "") {
			options.push({"label": val2, "value": val2});
		}
		$w("#dropdown25").options = options;
		$w("#dropdown25").value = "[none]";
	});
	$w("#dropdown26").onChange((event) => {
		let options = [{"label": "[none]", "value": "[none]"}];
		const val1 = $w("#dropdown27").value;
		const val2 = $w("#dropdown26").value;
		if (val1 !== "[none]" && val1 !== "") {
			options.push({"label": val1, "value": val1});
		}
		if (val2 !== "[none]" && val2 !== "") {
			options.push({"label": val2, "value": val2});
		}
		$w("#dropdown25").options = options;
		$w("#dropdown25").value = "[none]";
	});

	$w("#dropdown30").onChange((event) => {
		let options = [{"label": "[none]", "value": "[none]"}];
		const val1 = $w("#dropdown30").value;
		const val2 = $w("#dropdown29").value;
		if (val1 !== "[none]" && val1 !== "") {
			options.push({"label": val1, "value": val1});
		}
		if (val2 !== "[none]" && val2 !== "") {
			options.push({"label": val2, "value": val2});
		}
		$w("#dropdown28").options = options;
		$w("#dropdown28").value = "[none]";
	});
	$w("#dropdown29").onChange((event) => {
		let options = [{"label": "[none]", "value": "[none]"}];
		const val1 = $w("#dropdown30").value;
		const val2 = $w("#dropdown29").value;
		if (val1 !== "[none]" && val1 !== "") {
			options.push({"label": val1, "value": val1});
		}
		if (val2 !== "[none]" && val2 !== "") {
			options.push({"label": val2, "value": val2});
		}
		$w("#dropdown28").options = options;
		$w("#dropdown28").value = "[none]";
	});

	$w("#dropdown33").onChange((event) => {
		let options = [{"label": "[none]", "value": "[none]"}];
		const val1 = $w("#dropdown33").value;
		const val2 = $w("#dropdown32").value;
		if (val1 !== "[none]" && val1 !== "") {
			options.push({"label": val1, "value": val1});
		}
		if (val2 !== "[none]" && val2 !== "") {
			options.push({"label": val2, "value": val2});
		}
		$w("#dropdown31").options = options;
		$w("#dropdown31").value = "[none]";
	});
	$w("#dropdown32").onChange((event) => {
		let options = [{"label": "[none]", "value": "[none]"}];
		const val1 = $w("#dropdown33").value;
		const val2 = $w("#dropdown32").value;
		if (val1 !== "[none]" && val1 !== "") {
			options.push({"label": val1, "value": val1});
		}
		if (val2 !== "[none]" && val2 !== "") {
			options.push({"label": val2, "value": val2});
		}
		$w("#dropdown31").options = options;
		$w("#dropdown31").value = "[none]";
	});

	$w("#dropdown36").onChange((event) => {
		let options = [{"label": "[none]", "value": "[none]"}];
		const val1 = $w("#dropdown36").value;
		const val2 = $w("#dropdown35").value;
		if (val1 !== "[none]" && val1 !== "") {
			options.push({"label": val1, "value": val1});
		}
		if (val2 !== "[none]" && val2 !== "") {
			options.push({"label": val2, "value": val2});
		}
		$w("#dropdown34").options = options;
		$w("#dropdown34").value = "[none]";
	});
	$w("#dropdown35").onChange((event) => {
		let options = [{"label": "[none]", "value": "[none]"}];
		const val1 = $w("#dropdown36").value;
		const val2 = $w("#dropdown35").value;
		if (val1 !== "[none]" && val1 !== "") {
			options.push({"label": val1, "value": val1});
		}
		if (val2 !== "[none]" && val2 !== "") {
			options.push({"label": val2, "value": val2});
		}
		$w("#dropdown34").options = options;
		$w("#dropdown34").value = "[none]";
	});

	$w("#dropdown39").onChange((event) => {
		let options = [{"label": "[none]", "value": "[none]"}];
		const val1 = $w("#dropdown39").value;
		const val2 = $w("#dropdown38").value;
		if (val1 !== "[none]" && val1 !== "") {
			options.push({"label": val1, "value": val1});
		}
		if (val2 !== "[none]" && val2 !== "") {
			options.push({"label": val2, "value": val2});
		}
		$w("#dropdown37").options = options;
		$w("#dropdown37").value = "[none]";
	});
	$w("#dropdown38").onChange((event) => {
		let options = [{"label": "[none]", "value": "[none]"}];
		const val1 = $w("#dropdown39").value;
		const val2 = $w("#dropdown38").value;
		if (val1 !== "[none]" && val1 !== "") {
			options.push({"label": val1, "value": val1});
		}
		if (val2 !== "[none]" && val2 !== "") {
			options.push({"label": val2, "value": val2});
		}
		$w("#dropdown37").options = options;
		$w("#dropdown37").value = "[none]";
	});

	$w("#dropdown42").onChange((event) => {
		let options = [{"label": "[none]", "value": "[none]"}];
		const val1 = $w("#dropdown42").value;
		const val2 = $w("#dropdown41").value;
		if (val1 !== "[none]" && val1 !== "") {
			options.push({"label": val1, "value": val1});
		}
		if (val2 !== "[none]" && val2 !== "") {
			options.push({"label": val2, "value": val2});
		}
		$w("#dropdown40").options = options;
		$w("#dropdown40").value = "[none]";
	});
	$w("#dropdown41").onChange((event) => {
		let options = [{"label": "[none]", "value": "[none]"}];
		const val1 = $w("#dropdown42").value;
		const val2 = $w("#dropdown41").value;
		if (val1 !== "[none]" && val1 !== "") {
			options.push({"label": val1, "value": val1});
		}
		if (val2 !== "[none]" && val2 !== "") {
			options.push({"label": val2, "value": val2});
		}
		$w("#dropdown40").options = options;
		$w("#dropdown40").value = "[none]";
	});

	$w("#dropdown45").onChange((event) => {
		let options = [{"label": "[none]", "value": "[none]"}];
		const val1 = $w("#dropdown45").value;
		const val2 = $w("#dropdown44").value;
		if (val1 !== "[none]" && val1 !== "") {
			options.push({"label": val1, "value": val1});
		}
		if (val2 !== "[none]" && val2 !== "") {
			options.push({"label": val2, "value": val2});
		}
		$w("#dropdown43").options = options;
		$w("#dropdown43").value = "[none]";
	});
	$w("#dropdown44").onChange((event) => {
		let options = [{"label": "[none]", "value": "[none]"}];
		const val1 = $w("#dropdown45").value;
		const val2 = $w("#dropdown44").value;
		if (val1 !== "[none]" && val1 !== "") {
			options.push({"label": val1, "value": val1});
		}
		if (val2 !== "[none]" && val2 !== "") {
			options.push({"label": val2, "value": val2});
		}
		$w("#dropdown43").options = options;
		$w("#dropdown43").value = "[none]";
	});

	$w("#dropdown48").onChange((event) => {
		let options = [{"label": "[none]", "value": "[none]"}];
		const val1 = $w("#dropdown48").value;
		const val2 = $w("#dropdown47").value;
		if (val1 !== "[none]" && val1 !== "") {
			options.push({"label": val1, "value": val1});
		}
		if (val2 !== "[none]" && val2 !== "") {
			options.push({"label": val2, "value": val2});
		}
		$w("#dropdown46").options = options;
		$w("#dropdown46").value = "[none]";
	});
	$w("#dropdown47").onChange((event) => {
		let options = [{"label": "[none]", "value": "[none]"}];
		const val1 = $w("#dropdown48").value;
		const val2 = $w("#dropdown47").value;
		if (val1 !== "[none]" && val1 !== "") {
			options.push({"label": val1, "value": val1});
		}
		if (val2 !== "[none]" && val2 !== "") {
			options.push({"label": val2, "value": val2});
		}
		$w("#dropdown46").options = options;
		$w("#dropdown46").value = "[none]";
	});

	$w("#dropdown51").onChange((event) => {
		let options = [{"label": "[none]", "value": "[none]"}];
		const val1 = $w("#dropdown51").value;
		const val2 = $w("#dropdown50").value;
		if (val1 !== "[none]" && val1 !== "") {
			options.push({"label": val1, "value": val1});
		}
		if (val2 !== "[none]" && val2 !== "") {
			options.push({"label": val2, "value": val2});
		}
		$w("#dropdown49").options = options;
		$w("#dropdown49").value = "[none]";
	});
	$w("#dropdown50").onChange((event) => {
		let options = [{"label": "[none]", "value": "[none]"}];
		const val1 = $w("#dropdown51").value;
		const val2 = $w("#dropdown50").value;
		if (val1 !== "[none]" && val1 !== "") {
			options.push({"label": val1, "value": val1});
		}
		if (val2 !== "[none]" && val2 !== "") {
			options.push({"label": val2, "value": val2});
		}
		$w("#dropdown49").options = options;
		$w("#dropdown49").value = "[none]";
	});

	$w("#dropdown54").onChange((event) => {
		let options = [{"label": "[none]", "value": "[none]"}];
		const val1 = $w("#dropdown54").value;
		const val2 = $w("#dropdown53").value;
		if (val1 !== "[none]" && val1 !== "") {
			options.push({"label": val1, "value": val1});
		}
		if (val2 !== "[none]" && val2 !== "") {
			options.push({"label": val2, "value": val2});
		}
		$w("#dropdown52").options = options;
		$w("#dropdown52").value = "[none]";
	});
	$w("#dropdown53").onChange((event) => {
		let options = [{"label": "[none]", "value": "[none]"}];
		const val1 = $w("#dropdown54").value;
		const val2 = $w("#dropdown53").value;
		if (val1 !== "[none]" && val1 !== "") {
			options.push({"label": val1, "value": val1});
		}
		if (val2 !== "[none]" && val2 !== "") {
			options.push({"label": val2, "value": val2});
		}
		$w("#dropdown52").options = options;
		$w("#dropdown52").value = "[none]";
	});

	$w("#dropdown57").onChange((event) => {
		let options = [{"label": "[none]", "value": "[none]"}];
		const val1 = $w("#dropdown57").value;
		const val2 = $w("#dropdown56").value;
		if (val1 !== "[none]" && val1 !== "") {
			options.push({"label": val1, "value": val1});
		}
		if (val2 !== "[none]" && val2 !== "") {
			options.push({"label": val2, "value": val2});
		}
		$w("#dropdown55").options = options;
		$w("#dropdown55").value = "[none]";
	});
	$w("#dropdown56").onChange((event) => {
		let options = [{"label": "[none]", "value": "[none]"}];
		const val1 = $w("#dropdown57").value;
		const val2 = $w("#dropdown56").value;
		if (val1 !== "[none]" && val1 !== "") {
			options.push({"label": val1, "value": val1});
		}
		if (val2 !== "[none]" && val2 !== "") {
			options.push({"label": val2, "value": val2});
		}
		$w("#dropdown55").options = options;
		$w("#dropdown55").value = "[none]";
	});

	$w("#dropdown60").onChange((event) => {
		let options = [{"label": "[none]", "value": "[none]"}];
		const val1 = $w("#dropdown60").value;
		const val2 = $w("#dropdown59").value;
		if (val1 !== "[none]" && val1 !== "") {
			options.push({"label": val1, "value": val1});
		}
		if (val2 !== "[none]" && val2 !== "") {
			options.push({"label": val2, "value": val2});
		}
		$w("#dropdown58").options = options;
		$w("#dropdown58").value = "[none]";
	});
	$w("#dropdown59").onChange((event) => {
		let options = [{"label": "[none]", "value": "[none]"}];
		const val1 = $w("#dropdown60").value;
		const val2 = $w("#dropdown59").value;
		if (val1 !== "[none]" && val1 !== "") {
			options.push({"label": val1, "value": val1});
		}
		if (val2 !== "[none]" && val2 !== "") {
			options.push({"label": val2, "value": val2});
		}
		$w("#dropdown58").options = options;
		$w("#dropdown58").value = "[none]";
	});

	$w("#dropdown63").onChange((event) => {
		let options = [{"label": "[none]", "value": "[none]"}];
		const val1 = $w("#dropdown63").value;
		const val2 = $w("#dropdown62").value;
		if (val1 !== "[none]" && val1 !== "") {
			options.push({"label": val1, "value": val1});
		}
		if (val2 !== "[none]" && val2 !== "") {
			options.push({"label": val2, "value": val2});
		}
		$w("#dropdown61").options = options;
		$w("#dropdown61").value = "[none]";
	});
	$w("#dropdown62").onChange((event) => {
		let options = [{"label": "[none]", "value": "[none]"}];
		const val1 = $w("#dropdown63").value;
		const val2 = $w("#dropdown62").value;
		if (val1 !== "[none]" && val1 !== "") {
			options.push({"label": val1, "value": val1});
		}
		if (val2 !== "[none]" && val2 !== "") {
			options.push({"label": val2, "value": val2});
		}
		$w("#dropdown61").options = options;
		$w("#dropdown61").value = "[none]";
	});

	$w("#dropdown66").onChange((event) => {
		let options = [{"label": "[none]", "value": "[none]"}];
		const val1 = $w("#dropdown66").value;
		const val2 = $w("#dropdown65").value;
		if (val1 !== "[none]" && val1 !== "") {
			options.push({"label": val1, "value": val1});
		}
		if (val2 !== "[none]" && val2 !== "") {
			options.push({"label": val2, "value": val2});
		}
		$w("#dropdown64").options = options;
		$w("#dropdown64").value = "[none]";
	});
	$w("#dropdown65").onChange((event) => {
		let options = [{"label": "[none]", "value": "[none]"}];
		const val1 = $w("#dropdown66").value;
		const val2 = $w("#dropdown65").value;
		if (val1 !== "[none]" && val1 !== "") {
			options.push({"label": val1, "value": val1});
		}
		if (val2 !== "[none]" && val2 !== "") {
			options.push({"label": val2, "value": val2});
		}
		$w("#dropdown64").options = options;
		$w("#dropdown64").value = "[none]";
	});

	$w("#dropdown69").onChange((event) => {
		let options = [{"label": "[none]", "value": "[none]"}];
		const val1 = $w("#dropdown69").value;
		const val2 = $w("#dropdown68").value;
		if (val1 !== "[none]" && val1 !== "") {
			options.push({"label": val1, "value": val1});
		}
		if (val2 !== "[none]" && val2 !== "") {
			options.push({"label": val2, "value": val2});
		}
		$w("#dropdown67").options = options;
		$w("#dropdown67").value = "[none]";
	});
	$w("#dropdown68").onChange((event) => {
		let options = [{"label": "[none]", "value": "[none]"}];
		const val1 = $w("#dropdown69").value;
		const val2 = $w("#dropdown68").value;
		if (val1 !== "[none]" && val1 !== "") {
			options.push({"label": val1, "value": val1});
		}
		if (val2 !== "[none]" && val2 !== "") {
			options.push({"label": val2, "value": val2});
		}
		$w("#dropdown67").options = options;
		$w("#dropdown67").value = "[none]";
	});

	$w("#dropdown72").onChange((event) => {
		let options = [{"label": "[none]", "value": "[none]"}];
		const val1 = $w("#dropdown72").value;
		const val2 = $w("#dropdown71").value;
		if (val1 !== "[none]" && val1 !== "") {
			options.push({"label": val1, "value": val1});
		}
		if (val2 !== "[none]" && val2 !== "") {
			options.push({"label": val2, "value": val2});
		}
		$w("#dropdown70").options = options;
		$w("#dropdown70").value = "[none]";
	});
	$w("#dropdown71").onChange((event) => {
		let options = [{"label": "[none]", "value": "[none]"}];
		const val1 = $w("#dropdown72").value;
		const val2 = $w("#dropdown71").value;
		if (val1 !== "[none]" && val1 !== "") {
			options.push({"label": val1, "value": val1});
		}
		if (val2 !== "[none]" && val2 !== "") {
			options.push({"label": val2, "value": val2});
		}
		$w("#dropdown70").options = options;
		$w("#dropdown70").value = "[none]";
	});

	$w("#dropdown75").onChange((event) => {
		let options = [{"label": "[none]", "value": "[none]"}];
		const val1 = $w("#dropdown75").value;
		const val2 = $w("#dropdown74").value;
		if (val1 !== "[none]" && val1 !== "") {
			options.push({"label": val1, "value": val1});
		}
		if (val2 !== "[none]" && val2 !== "") {
			options.push({"label": val2, "value": val2});
		}
		$w("#dropdown73").options = options;
		$w("#dropdown73").value = "[none]";
	});
	$w("#dropdown74").onChange((event) => {
		let options = [{"label": "[none]", "value": "[none]"}];
		const val1 = $w("#dropdown75").value;
		const val2 = $w("#dropdown74").value;
		if (val1 !== "[none]" && val1 !== "") {
			options.push({"label": val1, "value": val1});
		}
		if (val2 !== "[none]" && val2 !== "") {
			options.push({"label": val2, "value": val2});
		}
		$w("#dropdown73").options = options;
		$w("#dropdown73").value = "[none]";
	});

	// entry name = even 2-52 except 22
	// pts = odd 1-51 except 21
});
