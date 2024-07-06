 function menu() {

     /*===== EXPANDER MENU  =====*/
     const showMenu = (toggleId, navbarId, bodyId, navLinkId, toggleIdSidebar) => {
         const toggle = document.getElementById(toggleId),
             navbar = document.getElementById(navbarId),
             bodypadding = document.getElementById(bodyId),
             navLink = document.getElementById(navLinkId),
             toggleSidebar = document.getElementById(toggleIdSidebar)


         if (toggle && navbar && toggleSidebar) {
             toggle.addEventListener('click', () => {
                 navbar.classList.toggle('expander')
                 navLink.classList.toggle('expander-link')
                 bodypadding.classList.toggle('body-pd')
             })

             toggleSidebar.addEventListener('click', () => {
                 navbar.classList.toggle('expander')
                 navLink.classList.toggle('expander-link')
                 bodypadding.classList.toggle('body-pd')
             })
         }
     }
     showMenu('nav-toggle', 'navbar', 'body-pd', 'nav-list', 'nav-toggle-sidebar')

     /*===== LINK ACTIVE  =====*/
     const linkColor = document.querySelectorAll('.nav__link')

     function colorLink() {
         linkColor.forEach(l => l.classList.remove('active'))
         this.classList.add('active')
     }
     linkColor.forEach(l => l.addEventListener('click', colorLink))


     /*===== COLLAPSE MENU  =====*/
     const linkCollapse = document.getElementsByClassName('collapse__link')
     var i

     for (i = 0; i < linkCollapse.length; i++) {
         linkCollapse[i].addEventListener('click', function() {
             const collapseMenu = this.nextElementSibling
             collapseMenu.classList.toggle('showCollapse')
             console.log('hola')
             const rotate = collapseMenu.previousElementSibling
             rotate.classList.toggle('rotate')
         })
     }

 }