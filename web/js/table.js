/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var table = d3.select('body').append('table').attr('id','anime-table').attr('class','tablesorter'); //tableタグ追加
var thead = table.append('thead'); //theadタグ追加
var tbody = table.append('tbody'); //tbodyタグ追加

//csv読み込み
d3.csv('data/anime.csv', function(csv){
    var headerKyes = d3.map(csv[0]).keys(); //ヘッダー用にkeyを取得

    thead.append('tr')    //trタグ追加
        .selectAll('th') 
        .data(headerKyes) 
        .enter()
        .append('th').attr('class','header')    //thタグ追加
        .text(function(key){return key});

    tbody.selectAll('tr')
        .data(csv)
        .enter()
        .append('tr')    //trタグ追加
            .selectAll('td')
            .data(function (row) { 
                      return d3.entries(row); //rowオブジェクトを配列へ変換
            }) 
            .enter()
            .append('td')    //tdタグ追加   
            .text(function(d){ return d.value })
    
    addModalLink();
    /* d3のCSV表が描画された後に、tablesorterメソッドを実行 */
    $(document).ready(function() {
        $('#anime-table').tablesorter();
        widgets: ['zebra']
    });

})

/* 生成されたTableにリンクを付ける.　*/
function addModalLink() 
{ 
    $("#anime-table > tbody > tr > td:nth-child(2)").wrapInner("<a href=\"#div-modal\" role=\"button\" class=\"bin\" data-toggle=\"modal\" />");
    
    //クリックイベントの登録
    $("#anime-table > tbody > tr > td:nth-child(2) > a").click(function() {        
        //クリックした箇所の判定をし、要素を取得
        
        //クリックした場所の取得
        var index =  $("#anime-table > tbody > tr > td:nth-child(2) > a").index(this) + 1;

        //コンテンツ取得
        var contents =  $("#anime-table > tbody > tr:nth-child("+index.toString()+") > td");       

        var chartHeader = ["シナリオ","キャラクター","演出","音楽","作画"];
        var chartContents = [];
        for(var i=3;i<=7;i++) {
            chartContents.push( $(contents[i]).text());
        }
        //<h4 class="modal-title">タイトル</h4>
        var text = $(".modal-title").text($(contents[1]).text());
        console.log(text);        
        //<div class="modal-body">
        $(".modal-body > #anime-eval").html(
                "<table class = \"table table-striped table-hover table-condensed\" align=\"center\">" +
                "<thead><tr><th>総合点数</th><th>シナリオ</th><th>キャラクター</th><th>演出</th><th>音楽</th><th>作画</th><th>年度</th><th>視聴回数</th><th>ジャンル</th><th>視聴話数</th><th>全話数</th><th>ステータス</th><th>備考</th></tr></thead>" + 
                "<tbody>" +
                "<tr>" +
                   "<td>" + $(contents[2]).text() + "</td>" +
                   "<td>" + $(contents[3]).text() + "</td>" +
                   "<td>" + $(contents[4]).text() + "</td>" +
                   "<td>" + $(contents[5]).text() + "</td>" +
                   "<td>" + $(contents[6]).text() + "</td>" +
                   "<td>" + $(contents[7]).text() + "</td>" +
                   "<td>" + $(contents[8]).text() + "</td>" +
                   "<td>" + $(contents[9]).text() + "</td>" +
                   "<td>" + $(contents[10]).text() + "</td>" +
                  "<td>"  + $(contents[11]).text() + "</td>" +
                   "<td>" + $(contents[12]).text() + "</td>" +
                  "<td>"  + $(contents[13]).text() + "</td>" +
                   "<td>" + $(contents[14]).text() + "</td>" +
               "</tr>" +
                   "</tbody>" +
                   "</table>" 
                );
        jQuery(function ($) {
            $('#div-modal').on('shown.bs.modal', function (event) {
                /* ChartJS */
                //レーダーチャート描画
                $(".modal-body > #anime-canvas").html("<canvas id=\"radarChart\" height=\"300\" width=\"300\"></canvas>");
                var ctx = document.getElementById("radarChart").getContext("2d");
                var data = {
                    labels: chartHeader,
                    datasets: [
                        {
                            label: "My First dataset",
                            fillColor: "rgba(100,100,220,0.2)",
                            strokeColor: "rgba(220,220,220,1)",
                            pointColor: "rgba(220,220,220,1)",
                            pointStrokeColor: "#fff",
                            pointHighlightFill: "#fff",
                            pointHighlightStroke: "rgba(220,220,220,1)",
                            data: chartContents
                        }
                    ]
                };
                var option = {
                  //Boolean - Whether to show lines for each scale point
                    scaleShowLine : true,

                    //Boolean - Whether we show the angle lines out of the radar
                    angleShowLineOut : true,

                    //Boolean - Whether to show labels on the scale
                    scaleShowLabels : false,

                    // Boolean - Whether the scale should begin at zero
                    scaleBeginAtZero : true,

                    //String - Colour of the angle line
                    angleLineColor : "rgba(0,0,0,.1)",

                    //Number - Pixel width of the angle line
                    angleLineWidth : 1,

                    //String - Point label font declaration
                    pointLabelFontFamily : "'Arial'",

                    //String - Point label font weight
                    pointLabelFontStyle : "normal",

                    //Number - Point label font size in pixels
                    pointLabelFontSize : 10,

                    //String - Point label font colour
                    pointLabelFontColor : "#666",

                    //Boolean - Whether to show a dot for each point
                    pointDot : true,

                    //Number - Radius of each point dot in pixels
                    pointDotRadius : 3,

                    //Number - Pixel width of point dot stroke
                    pointDotStrokeWidth : 1,

                    //Number - amount extra to add to the radius to cater for hit detection outside the drawn point
                    pointHitDetectionRadius : 20,

                    //Boolean - Whether to show a stroke for datasets
                    datasetStroke : true,

                    //Number - Pixel width of dataset stroke
                    datasetStrokeWidth : 2,

                    //Boolean - Whether to fill the dataset with a colour
                    datasetFill : true,

                    //String - A legend template
                    legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].strokeColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>"
                };
                //グラフを描画する
                var myNewChart = new Chart(ctx).Radar(data,option);
            });
        });
    });
}
