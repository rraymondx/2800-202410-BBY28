function checkTheList(){
    var form = $('#checklistForm');
    const savedChecklist = form.attr('savedChecklist').split(',');
    const button = form.find('button');
    var inputs = form.find('input');
    for (let i = 0; i < inputs.length; i++) {
        if (savedChecklist[i] == 'true') {
            inputs[i].checked = true;
        } else {
            inputs[i].checked = false;
        }
    }
    inputs.on('change', function() {
        button[0].disabled = false;
    });
    
}

$(checkTheList());
