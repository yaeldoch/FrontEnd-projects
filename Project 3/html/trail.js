Email = {
    Send : function (to,from,subject,body,apikey)
       {
           if (apikey == undefined)
           {
               apikey = Email.apikey;
           }
           var nocache= Math.floor((Math.random() * 1000000) + 1);
           var strUrl = "http://directtomx.azurewebsites.net/mx.asmx/Send?";
           strUrl += "apikey=" + apikey;
           strUrl += "&from=" + from;
           strUrl += "&to=" + to;
           strUrl += "&subject=" + encodeURIComponent(subject);
           strUrl += "&body=" + encodeURIComponent(body);
           strUrl += "&cachebuster=" + nocache;
           Email.addScript(strUrl);
       },
       apikey : "",
       addScript : function(src){
               var s = document.createElement( 'link' );
               s.setAttribute( 'rel', 'stylesheet' );
               s.setAttribute( 'type', 'text/xml' );
               s.setAttribute( 'href', src);
               document.body.appendChild( s );
       }
   };
   
   
    window.onload = function(){
       Email.apikey = "-- Your api key ---";
       Email.Send("yaeldoch@gmail.com","yaeldoch@gmail.com","Sent","hi there!");}



       <div><button id="print" onclick="window.print();return false;" type="text/css" media="print" body
       {visibility:hidden;} .print {visibility:visible;}>print</button></div>