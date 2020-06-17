var boolean = false;
var proxyUrl = "https://jsonp.afeld.me/?url=";
var counter = 0;
var amountforloop = 0;
var searchField = localStorage.getItem("Search Key");
var photosAmount = localStorage.getItem("Amount Of Photos");
var page = localStorage.getItem("Photos Page");
var backHeight = localStorage.getItem("Background Height");
var backWidth = localStorage.getItem("Background Width");
var apiKey = localStorage.getItem("API Key");

$(document).ready(function() {
    if((searchField && photosAmount && page && backHeight & backWidth && apiKey) != null) {
        $("#searchField").val(searchField);
        $("#amount").val(photosAmount);
        $("#page").val(page);
        $("#backHeight").val(backHeight);
        $("#backWidth").val(backWidth);
        $("#apiField").val(apiKey);
    }

    $("#searchBtn").click(async function() {
        /*$.ajax({
            type: "GET",
            url:  "https://wall.alphacoders.com/api2.0/get.php?auth=9dd02b767949246e3bc1799ee12aea60&method=search&info_level=2&term=" + $("#searchField").val().replace(" ", "+") + "&page=" + $("#amount").val() + "&check_last=1",
            crossDomain: true,
            async: true,
            dataType: "json",
            success: function(data) {
                var numberID = 1;
                var photoID;
                var counter = 0;
                $("#main-body").append("<br>")
                data.wallpapers.forEach(photo => {
                    photoID = document.getElementById("photo" + numberID);
                    if(photoID != null) {
                        document.getElementById("photo" + numberID).src = photo.url_image;
                    }else {
                        if(counter == 5) {
                            $("#main-body").append("<br>")
                            $("#main-body").append("<img id=photo" + numberID + "style='margin:10px;' width=200 height=200 src=" + photo.url_image + ">");
                            counter = 0;
                        }else {
                            $("#main-body").append("<img id=photo" + numberID + " width=200 height=200 src=" + photo.url_image + ">");
                        }
                        counter++;
                    }
                    numberID++;
                });
            },
        });*/

        $("#downloadBtn").fadeIn(800);
        localStorage.setItem("Search Key", $("#searchField").val());
        localStorage.setItem("Amount Of Photos", $("#amount").val());
        localStorage.setItem("Photos Page", $("#page").val());
        localStorage.setItem("Background Height", $("#backHeight").val());
        localStorage.setItem("Background Width", $("#backWidth").val());
        localStorage.setItem("API Key", $("#apiField").val());
        $.ajax({
            type: "GET",
            url:  "https://api.pexels.com/v1/search?query=" + $("#searchField").val() + "&per_page=" + $("#amount").val() + "&page=" + $("#page").val(),
            crossDomain: true,
            async: true,
            dataType: "json",
            headers: {
                Authorization: $("#apiField").val()
            },
            success: function(data) {
                var i;
                var removeID = 1;
                if($("#amount").val() < amountforloop) {
                    for(i = 0; i < amountforloop; i++) {
                        document.getElementById("photo" + removeID).remove();
                        removeID++;
                    }
                    amountforloop = 0;
                }
                var numberID = 1;
                var photoID;
                data.photos.forEach(photo => {
                    photoID = document.getElementById("photo" + numberID);
                    if(photoID != null) {
                        document.getElementById("photo" + numberID).src = photo.src.original + "?h=" + $("#backHeight").val() + "&w=" + $("#backWidth").val();
                    }else {
                        if(counter == 5) {
                            $("#body").append("<img id=photo" + numberID + " style='margin-left: 4px;' width=200 height=200 src=" + photo.src.original + "?h=" + $("#backHeight").val() + "&w=" + $("#backWidth").val() + ">");
                            $("photo" + numberID).fadeIn(1000);
                            counter = 0;
                        }else {
                            $("#body").append("<img id=photo" + numberID + " style='margin-left: 4px;' width=200 height=200 src=" + photo.src.original + "?h=" + $("#backHeight").val() + "&w=" + $("#backWidth").val() + ">");
                            $("photo" + numberID).fadeIn(1000);
                        }
                        counter++;
                    }
                    if(amountforloop < numberID) {
                        amountforloop++;
                    }
                    numberID++;
                });
                $("#footer").fadeIn(800);
            },
        });
    });

    $("#downloadBtn").click(function() {
        document.getElementById("downloadStatus").innerHTML = "Downloading...";
        $("#downloadStatus").fadeIn(1000);
        var i;
        var id = 1;
        var zip = new JSZip();
        for( i = 0; i < amountforloop; i++) {
            zip.file("photo" + id + ".jpeg", urlToPromise(document.getElementById("photo" + id).src), {binary:true});
            id++;
        }
        zip.generateAsync({type:"blob"})
        .then(async function (blob) {
            saveAs(blob, "backgrounds.zip");
            document.getElementById("downloadStatus").innerHTML = "Done!";
            await sleep(2000)
            $("#downloadStatus").fadeOut(1000);
        });
    });

    $("#getApiBtn").click(function() {
        window.open("https://www.pexels.com/api/new/", "_blank");
    });

    $("#previousBtn").click(function() {
        if(parseInt($("#page").val()) - 1 != 0 && $("#downloadBtn").css("display") == "inline-block") {
            $("#page").val(parseInt($("#page").val()) - 1);
            localStorage.setItem("Photos Page", $("#page").val());
            pexelsGet();
        }
    });

    $("#nextBtn").click(function() {
        if($("#downloadBtn").css("display") == "inline-block") {
            $("#page").val(parseInt($("#page").val()) + 1);
            localStorage.setItem("Photos Page", $("#page").val());
            pexelsGet();
        }
    });
});

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

function urlToPromise(url) {
    return new Promise(function(resolve, reject) {
        JSZipUtils.getBinaryContent(url, function (err, data) {
            if(err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
}

function pexelsGet() {
    $.ajax({
        type: "GET",
        url:  "https://api.pexels.com/v1/search?query=" + $("#searchField").val() + "&per_page=" + $("#amount").val() + "&page=" + $("#page").val(),
        crossDomain: true,
        async: true,
        dataType: "json",
        headers: {
            Authorization: "563492ad6f91700001000001d21cc34364c94fa99ec90f65c2d1f418"
        },
        success: function(data) {
            var numberID = 1;
            var photoID;
            data.photos.forEach(photo => {
                photoID = document.getElementById("photo" + numberID);
                if(photoID != null) {
                    document.getElementById("photo" + numberID).src = photo.src.original + "?h=" + $("#backHeight").val() + "&w=" + $("#backWidth").val();
                }else {
                    if(counter == 5) {
                        $("#body").append("<img id=photo" + numberID + " style=margin: 100px; width=200 height=200 src=" + photo.src.original + "?h=" + $("#backHeight").val() + "&w=" + $("#backWidth").val() + ">");
                        $("photo" + numberID).fadeIn(1000);
                        counter = 0;
                    }else {
                        $("#body").append("<img id=photo" + numberID + " style=margin: 100px; width=200 height=200 src=" + photo.src.original + "?h=" + $("#backHeight").val() + "&w=" + $("#backWidth").val() + ">");
                        $("photo" + numberID).fadeIn(1000);
                    }
                    counter++;
                }
                if(amountforloop < numberID) {
                    amountforloop++;
                }
                numberID++;
            });
        },
    });
}

function openWindowWithPost(url, data) {
    var form = document.createElement("form");
    form.target = "_blank";
    form.method = "POST";
    form.action = url;
    form.style.display = "none";

    for (var key in data) {
        var input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = data[key];
        form.appendChild(input);
    }

    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
}