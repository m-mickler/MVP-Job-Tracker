let $home = $('#home');
let $userForm = $("#user-submit");
let $userForm2 = $("#user-submit2");
let $userForm3 = $("#user-submit3");
let $userForm4 = $("#user-submit4");
let $inputFirst = $("#new_first_name");
let $inputLast = $("#new_last_name");
let $User = $("#User1");
let $company = $("#Company2");
let $applied = $("#Applied2");
let $interview = $("#Interview2");
let $offer = $("#Offer2");
let $id = $("#ID2");
let $kanbanBoard = $(".kanban-board");
let $Companys = $("#company1");
let $Applieds = $("#applied1");
let $Interviews = $("#interview1");
let $Offers = $("#offer1");
let $company3 = $("#Company3");
let $company4 = $("#Company4");
let $applied4 = $("#Applied4");
let $interview4 = $("#Interview4");
let $offer4 = $("#Offer4");
let $heading = $(".kanban-heading-text");
let $id1 = $('input[name="entered-id"]');
let $id3 = $('#ID3');
let $id4 = $('#ID4');

//home button reloads the page
$home.click((event) => {
    window.location.reload();
});

// CREATES A NEW USER
$userForm.submit((event) => {
    event.preventDefault();
    let first_name = $inputFirst.val();
    let last_name = $inputLast.val(); 
    let newPerson = {first_name, last_name};
    fetch( 
        "/api/users",
        { 
        method: "POST",
        headers: {
        "Content-Type": "application/json"
        },
        body: JSON.stringify(newPerson)
    }).then((response) => {
        response.json()

    }).then((data) => {
        fetch("/api/users/new")
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
            $heading.empty();
            let newText = $(`<strong>REMEMBER THIS! ${data[0].first_name} ${data[0].last_name} - ${data[0].id}</strong>`)
            newText.appendTo($heading);
        });
    });
    $userForm[0].reset();
});

//ADDS A NEW JOB FOR A USER
$userForm2.submit((event) => {
    event.preventDefault();
    let company = $company.val();
    let applied = $applied.val(); 
    let interview = $interview.val();
    let TC_offer = $offer.val();
    let id = $id.val();
    offer = Number(offer);
    id = Number(id);
    let newJob = {company, applied, interview, TC_offer, id};
    console.log(newJob);
    fetch( 
        "/api/tracker",
        { 
        method: "POST",
        headers: {
        "Content-Type": "application/json"
        },
        body: JSON.stringify(newJob)
        }
    ).then((response) => {
        $.ajax({
            type: "GET",
            url: `/api/tracker/${id}`,
            contentType: "application/json",
            success: res => {
                $Companys.empty(); $Applieds.empty(); $Interviews.empty(); $Offers.empty();
                for(let i = 0; i < res.length; i++){
                    const newCompany = $(`<li>${res[i].company}</li>`);
                    newCompany.appendTo($Companys);
                    const newApplied = $(`<li>${res[i].applied}</li>`);
                    newApplied.appendTo($Applieds);
                    const newInterview = $(`<li>${res[i].interview}</li>`);
                    newInterview.appendTo($Interviews);
                    const newOffer = $(`<li>${res[i].tc_offer}</li>`);
                    newOffer.appendTo($Offers);
                };
                console.log(res)
            }
        })
        response.json()
    })
    $userForm2[0].reset();
});

//SELECTS A USER AND DISPLAYS THEIR NAME AND ID
$User.submit((event) => { 
    event.preventDefault();
    let id1 = $id1.val();
    console.log(id1);
    $.ajax({
        type: "GET",
        url: `/api/users/${id1}`,
        success: res => {
            $heading.empty();
            let newText = $(`<strong>${res.first_name} ${res.last_name} - ${res.id}</strong>`)
            newText.appendTo($heading);
            console.log(res)
        },
        contentType: "application/json"
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
        console.log('im a failure');
        window.location.reload();
    });
    $User[0].reset();
    $userForm.hide();
});

//DISPLAYS ALL JOB INFO RELATED TO THE SELECTED USER
$User.submit((event) => {
    event.preventDefault();
    let id1 = $id1.val();
    $.ajax({
        type: "GET",
        url: `/api/tracker/${id1}`,
        contentType: "application/json",
        success: res => {
            $Companys.empty(); $Applieds.empty(); $Interviews.empty(); $Offers.empty();
            for(let i = 0; i < res.length; i++){
                const newCompany = $(`<li>${res[i].company}</li>`);
                newCompany.appendTo($Companys);
                const newApplied = $(`<li>${res[i].applied}</li>`);
                newApplied.appendTo($Applieds);
                const newInterview = $(`<li>${res[i].interview}</li>`);
                newInterview.appendTo($Interviews);
                const newOffer = $(`<li>${res[i].tc_offer}</li>`);
                newOffer.appendTo($Offers);
            };
            console.log(res)
        }
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
        window.location.reload();
    });
    $User[0].reset();
});

// NOT DONE Will delete a job listing
$userForm3.submit((event) => { 
    event.preventDefault();
    let deletedId = $id3.val();
    let company = $company3.val();
    deletedId = Number(deletedId);
    console.log(deletedId);
    fetch( 
        `/api/tracker/${deletedId}/${company}`,
        { 
        method: "DELETE",
        headers: {
        "Content-Type": "application/json"
        }
        }
    ).then((response) => {
        $.ajax({
            type: "GET",
            url: `/api/tracker/${deletedId}`,
            contentType: "application/json",
            success: res => {
                $Companys.empty(); $Applieds.empty(); $Interviews.empty(); $Offers.empty();
                for(let i = 0; i < res.length; i++){
                    const newCompany = $(`<li>${res[i].company}</li>`);
                    newCompany.appendTo($Companys);
                    const newApplied = $(`<li>${res[i].applied}</li>`);
                    newApplied.appendTo($Applieds);
                    const newInterview = $(`<li>${res[i].interview}</li>`);
                    newInterview.appendTo($Interviews);
                    const newOffer = $(`<li>${res[i].tc_offer}</li>`);
                    newOffer.appendTo($Offers);
                };
                console.log(res)
            }
        })
    })
    $User[0].reset();
});

//updates job by id and company name
$userForm4.submit((event) => {
    event.preventDefault();
    let company = $company4.val();
    let applied = $applied4.val(); 
    let interview = $interview4.val();
    let TC_offer = $offer4.val();
    let id4 = $id4.val();
    TC_offer = Number(TC_offer);
    id4 = Number(id4);
    let update = {company, id4, applied, interview, TC_offer};
    if(applied === ''){
        delete update.applied;
    }
    if(interview === ''){
        delete update.interview;
    }
    if(TC_offer === 0){
        delete update.TC_offer;
    }
    console.log(update);
    fetch( 
        `/api/tracker/${id4}/${company}`,
        { 
        method: "PATCH",
        headers: {
        "Content-Type": "application/json"
        },
        body: JSON.stringify(update)
        }
    ).then((response) => {
        response.json()
        $.ajax({
            type: "GET",
            url: `/api/tracker/${id4}`,
            contentType: "application/json",
            success: res => {
                $Companys.empty(); $Applieds.empty(); $Interviews.empty(); $Offers.empty();
                for(let i = 0; i < res.length; i++){
                    const newCompany = $(`<li>${res[i].company}</li>`);
                    newCompany.appendTo($Companys);
                    const newApplied = $(`<li>${res[i].applied}</li>`);
                    newApplied.appendTo($Applieds);
                    const newInterview = $(`<li>${res[i].interview}</li>`);
                    newInterview.appendTo($Interviews);
                    const newOffer = $(`<li>${res[i].tc_offer}</li>`);
                    newOffer.appendTo($Offers);
                };
                console.log(res)
            }
        })
    })
    $userForm2[0].reset();
});