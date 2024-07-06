window.onload = () => {

    $('#switch').click(() => {

        var switchBtn = $(document.body).hasClass("dark")

        if (switchBtn) {
            $(this).attr('switch', 0);
            $("#body-pd").removeClass('dark');
            $('#switch').removeClass('activo');
        } else {
            $(this).attr('switch', 1);
            $("#body-pd").addClass('dark');
            $('#switch').addClass('activo');
        }


        // var dr = document.classList.contains('dark');
        //guardar en localstorage

        if (document.getElementsByClassName('dark').length != 1) {
            localStorage.setItem('modoscuro', 'true');

        } else {
            localStorage.setItem('modoscuro', 'false');

        }
    });

    //comprobar
    if (localStorage.getItem('modoscuro') === 'true') {
        $(document.body).addClass('dark');
        $('#switch').addClass('active');
    } else {
        $(document.body).removeClass('dark');
        $('#switch').removeClass('active');
    }

}




