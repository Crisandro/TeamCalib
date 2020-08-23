var inputfirst = document.getElementById("inputfirst");
var wrapper = document.getElementById("wrapper");
var jobs = [];
var reviewer = [];
var taggedrev = [];

function initcrisandro(){
    loadanimation();
    
    //displaying the second table
    var counter = new Counter();
    console.log(counter.current());
}

$('#input-excel').change(function(e){
    var reader = new FileReader();
    var name = e.target.files[0].name;
    reader.readAsArrayBuffer(e.target.files[0]);
    reader.onload = function(e) {
        var data = new Uint8Array(reader.result);
        var data2 = new Uint8Array(reader.result);
        var wb = XLSX.read(data,{type:'array',cellStyles:'true'});
        var ws = wb.Sheets["defects"];
        var rev = wb.Sheets["data"];
        //var htmlstr = XLSX.write(wb,{sheet:"defects", type:'binary',bookType:'html',cellStyles:'true'});
        //$('#wrapper')[0].innerHTML += htmlstr;
        
        //getting the datas from defects sheet
        data = new Object(XLSX.utils.sheet_to_json(ws));
        //transferring datas to jobs
        console.log(transfer(data).length);
        
        //getting the datas from data sheet
        data2 = new Object(XLSX.utils.sheet_to_json(rev));
        //transferring data2 to reviewer
        console.log(transfer2(data2).length);
        
        //for displaying the title
        $('#fortitle')[0].innerHTML += name;

        //function for the animation
        added();

        //displaying the table
        displaytable(jobs);
    }
    
    
});

function transfer(data){
    for( var i = 0; i < data.length ; i++){
        jobs.push(data[i]);
    }
    return jobs;
}

function transfer2(data){
    for( var i = 0; i < data.length ; i++){
        reviewer.push(data[i]);
    }
    return reviewer;
}


function displaytable(data){
    document.getElementById("tablebody").innerHTML = ''
    //console.log(jobs);
    //console.log(reviewer);
    
    
    for(var x = 0 ; x <= jobs.length ; x++){
        var correctpercent = jobs[x]["correct %"];
        var tr = document.createElement("tr");
        document.getElementById("tablebody").appendChild(tr);
        tr.setAttribute("id", x);


        for(var y = 0 ; y <= 5 ; y++){
            var td = document.createElement("td");
            var correct = document.createTextNode((correctpercent * 100).toFixed(2));
            
            if(y==0){
                
                var id = jobs[x].job_id;
                
                td.appendChild(correct);
                document.getElementById(x).appendChild(td);
                
            }else if(y==1){
                var link = jobs[x]["Link (from URL in JID)"];
                var JID = jobs[x].job_id;
                
                //adding a button for showing functionality
                var button = document.createElement("div");
                button.setAttribute("id","JID");
                button.setAttribute("class","showtable");
                button.textContent = jobs[x].job_id;
                td.appendChild(button);
                
                document.getElementById(x).appendChild(td);

                /*$("tr").hover(function(){
                    $(this).css("background-color", "#065446");
                }, 
                function(){
                    //highlight((correctpercent * 100).toFixed(2),x);
                    var num = (correctpercent * 100).toFixed(2);
                    if(num <= 50){
                        document.getElementById(x).style.backgroundColor = "#197163";
                    }
                });*/
                //adding functionality for the button to show who tagged 
               $(".showtable").click(function(event) {
                   $(this).css("background-color", "#056676");
                   var str = $(this).closest("#JID").text();
                    console.log(str);
                    var counter = new Counter();
                    reviewer.forEach(function (e) {
                        if(e.job_id == str){
                            this.addrev(e);
                        }
                    }, counter);
                   event.stopImmediatePropagation();
                   console.log(counter.current());
                   showtaggedtable(counter.current());
                   displaytable(jobs);
                });
                
            }else if(y==2){
                var correct = document.createTextNode(jobs[x].majority_policy);
                td.appendChild(correct);
                document.getElementById(x).appendChild(td);
            }else if(y==3){
                document.getElementById(x).appendChild(td);
            }else if(y==4){
                document.getElementById(x).appendChild(td);
            }else if(y==5){
                document.getElementById(x).appendChild(td);
                var correct = document.createElement("a");
                correct.setAttribute("href", link);
                correct.setAttribute("target","_blank");
                correct.setAttribute("id","content");
                correct.textContent = "show data";  
                td.appendChild(correct);
                td.setAttribute("id",jobs[x].job_id);
            }
            
        }
        //console.log((correctpercent * 100).toFixed(2));
        //highlighting 
        highlight((correctpercent * 100).toFixed(2),x);
        
        /*$("#JID").click(function(event) {
            document.getElementById(x).style.backgroundColor = "#065446";
            document.getElementById(x).style.color = "#fff";
         });*/
         
    }
}

function highlight(num , id){
    if(num <= 50){
        document.getElementById(id).style.backgroundColor = "#5eaaa8";
    }
}

function Counter() {
    this.count = [];
    let self = this;
    return {
        addrev: function (rev) {
            self.count.push(rev);
        },
        current: function () {
            return self.count;
        }
    }
}

function showtaggedtable(reviewertagged){
    document.getElementById("selectedJID").innerHTML = reviewertagged[0]["job_id"];
    document.getElementById("taggedas").innerHTML = "Majority Policy : "+reviewertagged[0]["majority_policy"];
    document.getElementById('secondbody').innerHTML = '';
    for(var x = 0 ; x < reviewertagged.length ; x++){
        var tr2 = document.createElement("tr");
        document.getElementById("secondbody").appendChild(tr2);
        tr2.setAttribute("id", x+"v2");
        for(var y = 0 ; y <= 7 ; y++){
            var td2 = document.createElement("td");
            if(y==0){
                var revname = document.createTextNode(reviewertagged[x]["actor_name"]);
                td2.appendChild(revname);
                document.getElementById(x+"v2").appendChild(td2);
                
            }else if(y==1){
                var revpolicy = document.createTextNode(reviewertagged[x]["actor_policy"]);
                td2.appendChild(revpolicy);
                document.getElementById(x+"v2").appendChild(td2);
            }else if(y==2){
                var revpolicy = document.createTextNode(reviewertagged[x]["Consistency"]);
                td2.appendChild(revpolicy);
                document.getElementById(x+"v2").appendChild(td2);
            }else if(y==3){
                var revpolicy = document.createTextNode(reviewertagged[x]["TRUE"]);
                td2.appendChild(revpolicy);
                document.getElementById(x+"v2").appendChild(td2);
            }else if(y==4){
                var revpolicy = document.createTextNode(reviewertagged[x]["FALSE"]);
                td2.appendChild(revpolicy);
                document.getElementById(x+"v2").appendChild(td2);
            }else if(y==5){
                var revpolicy = document.createTextNode(reviewertagged[x]["caltrue"]);
                td2.appendChild(revpolicy);
                document.getElementById(x+"v2").appendChild(td2);
            }else if(y==6){
                var revpolicy = document.createTextNode(reviewertagged[x]["calfalse"]);
                td2.appendChild(revpolicy);
                document.getElementById(x+"v2").appendChild(td2);
            }
            
        }
    }
}



function loadanimation(){
    inputfirst.style.animation = "increase 1s ease";
    wrapper.style.backgroundColor = "#e8ded2"
}

function added(){
    inputfirst.style.animation = "disappear 1s ease";
    inputfirst.style.display = "none";
    wrapper.style.animation = "wrap 1s ease";
    wrapper.style.backgroundColor = "#e8ded2";
} 


window.addEventListener("load", initcrisandro);