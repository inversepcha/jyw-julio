function agregar_implemento() {

    let implemento_nombre = $("#serial option:selected").text();

    if (zona_id > 0) {

        $("#tb").append(`
      <tr>
          <td>
              
          </td>
          <td>${implemento_nombre}</td>
          <td>
            <button class='Eliminar btn btn-danger btn-sm'><i class="fas fa-times"></i></button>
            
              
          </td>
      </tr>

  `);
        $(".Eliminar").on("click", function() {
            $(this).parent().parent().remove();
        });

    }
}