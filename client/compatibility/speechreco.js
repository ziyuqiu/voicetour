var disambiguationChoices = [];
var numAttempts = 0;

function applyIntent(intent,entities,mic) {
    var r = "";
    if (intent == undefined) {
        numAttempts++;
        switch(numAttempts) {
            case 1: r+="<p>Could you try that again?</p>"; break;
            case 2: r+="<p>Hmm. Could you say that once more?</p>"; break;
            case 3: r+="<p>I'm sorry, but I haven't been able to understand you. Once more?</p>"; break;
            case 4: r+="<p>Oh dear, I couldn't get that this time either. You can also try 'help' or 'what do you do?' for a list of supported commands.</p>"; break;
            default: r+="<p>Make sure your mic is working and either say <span class='arg'>help</span> or head over to the About page for a list of supported commands.</p>"; break;
        }
        $("#result").append(r);
    }
    else {
       numAttempts = 0;
       if (intent == "search_for_loc") {
           var searchTerm;
           if (entities["deis_loc"] != undefined) {
               if (entities["deis_loc"].value == "this_loc") {
                   $("#result").append("<p>Looking up this location...</p>");
                   searchTerm = Session.get("inLocation")[0].name;
               }
               else {
                   searchTerm = entities["deis_loc"].body;
                    $("#result").append("<p>Searching for <span class='said'>" + searchTerm +"</span>...</p>");
               }
           }
           else if (entities["location_category"] != undefined) {
              searchTerm = entities["location_category"].body;
                    $("#result").append("<p>Looking for <span class='said'>" + searchTerm +"</span>...</p>");
           }
           
           Session.set("searchTerm",searchTerm);
           document.getElementById("searchBox").value = Session.get("searchTerm");
            
           $("#searchBox").show("slow");
            
           $("#searchBox").focus();
            
           Router.go('/search');
        }
        else if (intent == "navigate") {
            r += "Navigating to ";
            var disDestination = "";
            if (entities["end"] != undefined) {
               disDestination = disambiguate(entities["end"].value);
               if (!disDestination) {
                   r += "<span class='said'>"+entities["end"].body+"</span>";
                   Session.set("navigateTo",entities["end"].value);
               }
            }
            else {
               disDestination = disambiguate(entities["deis_loc"].value);
               if (entities["deis_loc"] != undefined) {
                   if (!disDestination) {
                       r += "<span class='said'>"+entities["deis_loc"].body+"</span>";
                       Session.set("navigateTo",entities["deis_loc"].value);
                   }
               }
            }
            
            if (entities["start"] != undefined) {
                var disStart = disambiguate(entities["start"].value);
                if (!disStart) {
                     if (entities["start"] == "this_loc") {
                         r+= " from <span class='said'>this location</span>";
                         Session.set("navigateFrom","(" + Session.get("currentLocation").x + ", " + Session.get("currentLocation").y + ")");
                     }
                     else {
                        r += " from <span class='said'>"+entities["start"].body+"</span>";
                        Session.set("navigateFrom",entities["start"].value);
                     }                 
                }
            }
            else {
                Session.set("navigateFrom","(" + Session.get("currentLocation").x + ", " + Session.get("currentLocation").y + ")");
            }
            
            if (disDestination || disStart) {
                console.log(disambiguationChoices);        
            }
            else {
                $("#result").append("<p>"+r+"...</p>");
                if (Router.current().route.path() == "/navigate") {
                    document.getElementById("startpoint").value = Session.get("navigateFrom");
                    document.getElementById("endpoint").value = Session.get("navigateTo");
                    $("#navform").submit();
                }
                else {
                     Router.go('/navigate');
                }  
            }
        }
        else if (intent == "app_help") {
           
            r += "<p>So you need <span class='said'>help</span>? Here are some commands you can try:</p><ul>";
            
            r+= "<li>Search for <span class='arg'>science</span></li>";
            r+= "<li>How do I get to <span class='arg'>Admissions</span> from <span class='arg'>here</span>?</li>";
            r+= "<li>Take me to <span class='arg'>the SCC</span></li>";
            r+= "<li>Tell me about <span class='arg'>Volen</span></li>";
            //r+= "<li>When is <span class='arg'>the Faculty Club</span> open?</li>";
            //r+= "<li>Start a <span class='arg'>self-guided tour</span></li>";
            //r+= "<li>Open settings and <span class='arg'>switch to U.S. customary units</span></li>";
            r+= "<li>Where am I?</li>";
            //r+= "<li>What's nearby?</li>";
            //r+= "<li>What's happening <span class='arg'>here</span>?</li>";
            
            r+= "</ul>";
            
            $("#result").append(r);
        }
        else if (intent == "get_current_loc") {
            
            r += "<p>You're currently at <span class='arg'>"+Session.get("inLocation")[0].name+"</span>.</p>";
            r += "<p>Welcome!</p>";
            
            $("#result").append(r);
            
            var loc = Locations.findOne({"name":Session.get("inLocation")[0].name});
            Session.setPersistent("viewLocation",loc._id);
            Router.go('/viewLocation/'+loc._id);
        }
        else if (intent == "get_info_about_loc") {
            var loc = null;
            if (entities["deis_loc"].value == "this_loc") {
                loc = Locations.findOne({"name":Session.get("inLocation")[0].name});
                console.log(loc);
            }
            else {
                loc = Locations.findOne({"name":entities["deis_loc"].value});
            }
            
            r += "<p>"+loc.function+"</p>";
            r += "<p>And here's more info for your perusal.";
            
            $("#result").append(r);
            
            Session.setPersistent("viewLocation",loc._id);
            Router.go('/viewLocation/'+loc._id);
        }
        else if (intent == "start_tour") {
            if (entities["tour_type"] != undefined) {
                if (entities["tour_type"].value = "self") {
                    r += "<p>Starting up the <span class='said'>self-guided</span> tour...</p>";
                    
                    $("#result").append(r);
                    
                    Router.go('/selfguide');
                }
            }
        }
    }
    
    function disambiguate(entity) {
       
        var dis = "";
        var disambiguated = false;
        if (entity == "Shapiro") {
            disambiguationChoices = ["Carl J. Shapiro Science Center","Carl and Ruth Shapiro Admissions Center","Carl and Ruth Shapiro Campus Center","Shapiro Hall"];
            dis = "Did you mean the <span class='said'>Shapiro Science Center</span>, <span class='said'>Carl and Ruth Shapiro Admissions Center</span>, <span class='said'>Shapiro Campus Center</span>, or <span class='said'>Shapiro Hall</span> in Massell Quad?";
            
            Session.set("disambiguationChoices",disambiguationChoices);
            
             disambiguated = true;
        }
    
        if (disambiguated) {
            $("#result").append("<p>"+dis+"</p>");
        }
        return disambiguated;
    }
}

function startAudio() {
    navigator.getUserMedia = (navigator.getUserMedia || 
                          navigator.webkitGetUserMedia || 
                          navigator.mozGetUserMedia || 
                          navigator.msGetUserMedia);
    if (navigator.getUserMedia) {
        var mic = new Wit.Microphone(document.getElementById("microphone"));
        
        var info = function (msg) {
            document.getElementById("info").innerHTML = msg;
        };
        var error = function (msg) {
            document.getElementById("error").innerHTML = msg;
        };
        mic.onready = function () {
            info("Microphone is ready to record");
        };
        mic.onaudiostart = function () {
            info("Recording started");
            error("");
           
            $("#speechText").show("slow");
            $("#result").append("<h4>I'm listening!</h4>")
        };
        mic.onaudioend = function () {
            info("Recording stopped, processing started");
        };
        mic.onresult = function (intent, entities) {
            // console.log(intent + " " + entities);
            
            var r = kv("intent", intent);
    
            for (var k in entities) {
                var e = entities[k];
    
                if (!(e instanceof Array)) {
            r += kv(k, e.value);
                } else {
            for (var i = 0; i < e.length; i++) {
              r += kv(k, e[i].value);
            }
                }
            }
    
            document.getElementById("result").innerHTML = r;
            
            applyIntent(intent,entities,mic);
        };
        mic.onerror = function (err) {
            error("Error: " + err);
        };
        mic.onconnecting = function () {
            info("Microphone is connecting");
        };
        mic.ondisconnected = function () {
            info("Microphone is not connected");
        };
    
        mic.connect("ANATOUXNLPGVGPTGWPN7RXQHFYYSPGPP");
        // mic.start();
        mic.stop();
    }
}

function kv(k, v) {
    if (toString.call(v) !== "[object String]") {
        v = JSON.stringify(v);
    }
    return k + "=" + v + "\n";
}