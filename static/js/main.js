///////////////////////////////////////////
///////////////////////////////////////////
// this block of code is to define a new //
// tagname to include html snippets ///////
///////////////////////////////////////////
///////////////////////////////////////////

document.addEventListener("DOMContentLoaded",function(){
    let e=document.getElementsByTagName("include");
    for(var t=0;t<e.length;t++){
        let a=e[t];n(e[t].attributes.src.value,function(e){
            a.insertAdjacentHTML("afterend",e),a.remove()
        }
        )}
        function n(e,t){
            fetch(e).then(e=>e.text()).then(e=>t(e))
        }
    });



///////////////////////////////////////////
///////////////////////////////////////////
///////// Rest api call////////////////////
///////////////////////////////////////////
///////////////////////////////////////////

// base api url
const baseEndPoint = 'http://127.0.0.1:8000/api'
// base site url
const siteURL = window.location.protocol + '//' + window.location.host

///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
//function to get data from the base api url and //////
// insert base on the category and the page location //
///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
function getImageData(){
    var boolean_value;
    $.ajax({
        type: 'GET',
        headers: {
            "Content-Type": 'application/json'
        },
        url: `${baseEndPoint}/product`,
        success: function(respose){
            
            //product_image.empty()
            for (var i =0; i<respose.length; i++){                
                data = respose[i]
                if (data.product_category === 'weddings' && window.location.href === siteURL+'/weddings.html'){
                    itemObj(data.product_image, data.product_name)
                } else if (data.product_category === 'portrait' && window.location.href === siteURL+'/portrait.html'){
                    itemObj(data.product_image, data.product_name)
                } else if (data.product_category === 'pre-weddings' && window.location.href === siteURL+'/pre-weddings.html'){
                    itemObj(data.product_image, data.product_name)
                } else if ( window.location.href === siteURL+'/index.html' || window.location.href === siteURL+"/"){
                    itemObj(data.product_image, data.product_name)
                }
            }
            fadeData(boolean_value = true)
        },
        error: function(error){
            fadeData(boolean_value = false)     
        }
    })
    
}

function fadeData(boolean_value){
    var fetchData = $('#fetch')
    if (boolean_value){
        fetchData.fadeOut('3000', () => {
            fetchData.empty().fadeIn('slow').append(`<i class="fa fa-check text-success"></i><span> done</span>`)
        })
        setTimeout(() => {
            fetchData.fadeOut('slow')
        }, 5000)

    }else{
        fetchData.fadeOut('3000', () => {
            fetchData.empty().fadeIn('slow').append(`<i class="fa fa-warning text-warning"></i><span> Data not retrieved<button class="btn btn-primary mx-2 fs-4" id="refreshData">Refresh</button></span>`)
            refreshData()
        })
    }
}

function refreshData(){
    $('#refreshData').click(() =>{
        window.location.reload()
    })
}

///////////////////////////////////////////
///////////////////////////////////////////
// function to append the retrived ////////
// data from base api url /////////////////
///////////////////////////////////////////
///////////////////////////////////////////
function itemObj(src, alt){
    var product_image = $('#productAppend')
    product_image.append(
        `
        <div class="col-sm-6 col-lg-4 mb-4">
            <div class="card">
                <img src="${src}" alt="${alt}" width="100%"> 
            </div>
        </div>
        `
    )
}

var value = document.getElementsByClassName('modalClick')
for(var i=0;i<value.length;i++){
    value[i].addEventListener('click', function(){
        localStorage.setItem('price_category', this.dataset.price_category)
    })
}


// Fetch all the forms we want to apply custom Bootstrap validation styles to
const forms = $('.needs-validation')
// Loop over them and prevent submission
Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
    event.preventDefault()
    if (!form.checkValidity()) {
        event.stopPropagation()
        console.log("not-valid")
    }else{
        let newFormData = new FormData(form)
        let formObj = Object.fromEntries(newFormData)
        //get choice value from local storage
        formObj.choice = localStorage.getItem('price_category')

        $.ajax({
            type: "POST",
            headers: {
                "Content-Type": 'application/json'
            },
            url: `${baseEndPoint}/booking/`,
            data:JSON.stringify(formObj),
            success:function(respose){
                // empty the from after a completed process
                for(var i=0;i<form.length;i++){
                    form[i].value = ""
                }
                alert(respose.message)
            },
            error: function(error){
                if (error.responseJSON){
                    alert(error.responseJSON)
                }else{
                    alert("server error! try again later")
                }
                
            }
        })

    }    

    form.classList.add('was-validated')
    }, false)
})