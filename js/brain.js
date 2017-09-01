$(function(){
  $(document).ready(function() {
    window.fist = true;
    var json_code = $.getJSON('js/kladr.json', function(data) {
      beginBrain(data, false);
    })
    .fail(function() {
      var data = {
        0: false
      };
      beginBrain(data, true);
      console.log( "Server error, look at your Internet connection." );
    });
  }); 

  function beginBrain(data, isError) {
    new Vue({
      el: "#app",
      data: {
        json: window.json,
        message: '',
        messageIfError: '',
        messageNoResults: 'Ничего не найдено',
        search: {
          0: 'none'
        },
        countSearch: 0,
        countAll: 0,
        visible: false,
        visibleMessage: false,
        visibleItemsSearch: false,
        json_array: data
      },
      created: function () {
        window.addEventListener('keyup', this.onClick());
        if (isError) {
          this.messageIfError = 'Что-т опошло не так. Проверьте соединение с интернетом и попробуйте еще раз.';
        }
      },
      methods: {
        onClick: function() {

          this.countSearch = 0;
          var message = this.message;
          var data = this.json_array;
          var query_array = [];
          var index = 0;

          this.countAll = data.length;

          for (var i = 0; i < data.length; i++) {
            
            if (~data[i].City.indexOf(message)) {
              if (data[i].City !== '') {
                this.countSearch++;
                query_array[i] = data[i].City;
              }
            }
            

            if (query_array.length == 0) {
              this.visibleMessage = true;
              this.visibleItemsSearch = false;
              this.messageNoResults = 'Ничего не найдено';
            } else {
              this.visibleItemsSearch = true;
              this.visibleMessage = false;
              this.messageNoResults = '';
            }

            index++;
          }
            query_array.pop();
          /*console.log(query_array.length);
          this.countSearch = query_array.length;*/

          if (window.fist) {
            window.fist = false;
            this.visible = false;
          } else {
            this.visible = true;
          }

          this.search = query_array;
        },
        choseItem: function(object) {
          this.message = object.originalTarget.innerText;
          this.visible = false;
        },
        revertVisible: function() {
          this.visible = !this.visible;
        }
      }
    });
  }

});