var graphOptions = {
    segmentShowStroke: true,
    segmentStrokeColor: "#fff",
    segmentStrokeWidth: 0.5,
    percentageInnerCutout: 70,
    animationSteps: 100,
    animationEasing: "easeOutBounce",
    animateRotate: true,
    animateScale: false,
    animation: false,
    tooltipFillColor: "rgba(0,0,0,0.8)",
    tooltipTemplate: "<%if (label){%><%=label %>: <%}%><%= value + '%' %>",
    legendTemplate: "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<segments.length; i++){%><li><div class=\"doughnut-value\"><%=segments[i].value%>%</div><span style=\"background-color:<%=segments[i].fillColor%>\"></span><p><%if(segments[i].label){%><%=segments[i].label%><%}%></p></li><%}%></ul>"
};

Object.size = function (obj) {
    var size = 0,
        key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

function getColorName(languageName, codeColors) {
    if (languageName == "C#") // This is what Github calls it
        languageName = "C Sharp"; // This needs to be what it matches in the JSON file
    if (languageName == "C++")
        languageName = "Objective-C++";

    return codeColors[languageName] != null ? codeColors[languageName] : "#000";;
}

function getHighlightColor(color, percent) {
    var num = parseInt(color.slice(1), 16),
        amt = Math.round(2.55 * percent),
        R = (num >> 16) + amt,
        G = (num >> 8 & 0x00FF) + amt,
        B = (num & 0x0000FF) + amt;
    return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 + (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 + (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
}

function convertDataToPercentage(data) {
    var sum = 0;
    data.forEach(function (dataPoint) {
        sum += dataPoint.value;
    });
    data.forEach(function (dataPoint) {
        var percent = Math.round(10000 * (dataPoint.value / sum)) / 100;
        dataPoint.value = percent;
    });
    return data;
}

function buildLanguageGraph(graphDiv) {
    $("canvas").remove(".graphContent");

    graphDiv.append($("<canvas class='graphContent'></canvas>"));
    var graphCanvas = graphDiv.find("canvas")[0];
    var ctx = graphCanvas.getContext('2d');
    setTimeout(function () {
        var userName = graphDiv.data("user");
        var repoName = graphDiv.data("repo");
        if (ctx != null) {
            $.getJSON("https://raw.githubusercontent.com/doda/github-language-colors/master/colors.json", function (codeColors) {
                var request = new XMLHttpRequest();
                request.onload = function () {
                    var languages = JSON.parse(this.responseText);
                    var data = [];

                    for (var lang in languages) {
                        var dataColor = getColorName(lang, codeColors);
                        data.push({
                            value: languages[lang],
                            color: dataColor,
                            highlight: getHighlightColor(dataColor, 5),
                            label: lang
                        });
                    }

                    data = convertDataToPercentage(data);
                    var languageGraph = new Chart(ctx).Doughnut(data, graphOptions);
                };
                request.open('get', 'https://api.github.com/repos/' + userName + '/' + repoName + '/languages', true);
                request.send()
            });
        }
    }, 400);
}

$(".card-graph").hover(function () {
    buildLanguageGraph($(this));
});

// Touch / no-hover support: tap a card to toggle its details, tap the
// language graph to expand it. Hover devices keep their original behavior.
var supportsHover = window.matchMedia && window.matchMedia("(hover: hover)").matches;

if (!supportsHover) {
    $(".card").on("click", function (e) {
        // Let links/buttons (e.g. "View Code") behave normally.
        if ($(e.target).closest("a, button").length) {
            return;
        }

        var $card = $(this);

        // Tapping the language graph toggles just the graph.
        var $graph = $(e.target).closest(".card-graph");
        if ($graph.length && $card.hasClass("is-open")) {
            if (!$graph.hasClass("is-open")) {
                buildLanguageGraph($graph);
            }
            $graph.toggleClass("is-open");
            return;
        }

        // Otherwise toggle the card, closing any other open cards.
        var willOpen = !$card.hasClass("is-open");
        $(".card").removeClass("is-open");
        $(".card-graph").removeClass("is-open");
        if (willOpen) {
            $card.addClass("is-open");
        }
    });
}