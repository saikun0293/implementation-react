let data = {"name": null, "value": null };

function loadDoc(userJSON){

    
    c = userJSON
    console.log(c)
    console.log('Loading from file')
    for(var i=0;i<c.length;i++) {
        console.log(c[i].name,c[i].notes);
        // console.log('lop');
        console.log($('#uName1'));
        let n = `#uName${i+1}`
        let note = `#desc${i+1}`
        $(n).val(c[i].name)
        $(note).val(c[i].notes)
    };
    


}

const addData = () => {
  let uData1 = {
    id:0,
    name: document.getElementById("uName1").value,
    notes: document.getElementById("desc1").value,
  };
  let uData2 = {
    id:1,
    name: document.getElementById("uName2").value,
    notes: document.getElementById("desc2").value,
  };
  let uData3 = {
    id:2,
    name: document.getElementById("uName3").value,
    notes: document.getElementById("desc3").value,
  };
  let uData4 = {
    id:3,
    name: document.getElementById("uName4").value,
    notes: document.getElementById("desc4").value,
  };
  let uData5 = {
    id:4,
    name: document.getElementById("uName5").value,
    notes: document.getElementById("desc5").value,
  };

  let tempArr = []

  tempArr.push(uData1);
  tempArr.push(uData2);
  tempArr.push(uData3);
  tempArr.push(uData4);
  tempArr.push(uData5);
  data.value = JSON.stringify(tempArr)
  //document.forms[0].reset();

// display function
//   let pre = document.querySelector("#msg pre");
//   pre.textContent = "\n" + JSON.stringify(data, "\t", 2);

};

//Timer...
// window.onload = function () {
//   var x = 5;

//   setInterval(function () {
//     if (x <= 6 && x >= 1) {
//       x--;
//       if (x == 1) {
//         x = 6;
//       }
//     }
//   }, 1000);
  // Form Submitting after 5s
  var auto_refresh = setInterval(function () {
    addData()
    data.name = $("#docname").text()
    // let data = JSON.stringify(allData)
    // console.log(data,allData);
    let currentURL = window.location.pathname;
    $.post(window.location.href,data,function(data, status){

      console.log('File Saved Successfully!')
      console.log(data, status);
    //   fadeInOut()

      if(currentURL === '/newDots'){
        window.location = 'loadDots/' + $('#docname')[0].innerHTML 
      }

    });
  }, 5000);
// };
