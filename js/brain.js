$(function(){
  $(document).ready(function() {
    window.fist = true;
    var json_code = $.getJSON('js/kladr.json', function(data) {
      beginBrain(data, false);
    })
    .fail(function() {
      var data = { 0: false };
      beginBrain(data, true);
      console.log( "Server error, look at your Internet connection." );
    });
  }); 

  /*
   * Запуск автокомплита
   */
  function beginBrain(data, isError) {
    /*
     * --- Описание ---
     * Инициализируется класс фреймворка Vue.js,
     * в котором идет работа с DOM элементами
     *
     * @variables:
     * -- json               - json код данных
     * -- data               - Полный массив данных
     * -- i                  - Ключ итерации
     * -- message            - Текст в поиске
     * -- messageIfError     - Сообщение об ошибке
     * -- messageNoResults   - Сообщение о пустом результате
     * -- search             - Массив с отобранными данными
     * -- countSearch        - Количество найденных
     * -- countAll           - Полное количество элементов в базе
     * -- visible            - Активатор вывода дочернего блока
     * -- visibleMessage     - Активатор вывода сообщения
     * -- visibleItemsSearch - Активатор вывода списка найденных данных
     *
     * @methods:
     * -- performance        - Основная функция обработки данных, находит
     *                         совпавшие элементы, выводит/скрывает сообщения
     * -- choseItem          - Выбор элемента из списка найденных
     * -- revertVisible      - Переключатель видимости всего дочернего блока
     */
    new Vue({
      el: "#app",
      data: {
        json: window.json,

        inputStatus: 0,

        message: '',
        messageIfError: '',
        messageNoResults: 'Ничего не найдено',

        search: { 0: 'none' },

        countSearch: 0,
        countAll: 0,

        visible: false,
        visibleMessage: false,
        visibleItemsSearch: false,

        json_array: data
      },
      created: function () {
        window.addEventListener('keyup', this.performance());
        if (isError) {
          this.messageIfError = 'Что-то пошло не так. Проверьте соединение с интернетом и попробуйте еще раз.';
        }
      },
      methods: {
        performance: function(button = 'click') {

          navigation(button);

          /*
           * Если нажат Enter выбирается активный пункт 
           * из посказки и за тем скрывается подсказка
           */
          if (button.key == 'Enter') {
            this.message = $('.itemSearch ul.items .active')[0].innerText;
          }

          /*
           * --- Начало кода ---
           * Цикл по json массиву с добавлением совпавших данных,
           * по значению из поля ввода, в новый массив данных
           * @variables
           * -- data    - полный массив данных
           * -- i       - ключ итерации
           * -- message - текст в поиске
           * -- query_array - массив с отобранными данными
           */
          this.countSearch = 0;
          var message = this.message;
          var data = this.json_array;
          var query_array = [];
          this.countAll = data.length;

          for (var i = 0; i < data.length; i++) {
            if (~data[i].City.indexOf(message)) {
              if (data[i].City !== '') {
                this.countSearch++;
                query_array[i] = {
                  'city': data[i].City,
                  'key': this.countSearch,
                };
              }
            }
            
            /*
             * Если совпадений не найдено,
             * то показывается сообщение,
             * скрывается количество найденных данных
             * выводится сообщение "Ничег оне найдено"
             */
            if (query_array.length == 0) {
              if (message.length !== 0) {
                this.inputStatus = 2;
              }
              this.visibleMessage = true;
              this.visibleItemsSearch = false;
              this.messageNoResults = 'Ничего не найдено';
            } else {
              this.visibleItemsSearch = true;
              this.visibleMessage = false;
              this.messageNoResults = '';
            }
          }
          /* --- Конец кода -- */

          /*
           * --- Начало кода ---
           * Проверка на первичный запуск кода
           * глобальная переменная window.first изначально равна true
           * после первого исполнения кода эта переменная становится равна false
           */
          if (window.fist) {
            window.fist = false;
            this.visible = false;
          } else {
            this.visible = true;
          }
          /* --- Конец кода -- */

          this.search = query_array;
        },
        choseItem: function(object) {
          this.message = object.originalTarget.innerText;
          this.visible = false;
        },
        revertVisible: function() {
          this.visible = !this.visible;
        },
        closeVisible: function() {
          if (this.visible == true) {
            this.visible = false;
          }
        },
        openItems: function() {
          if (this.visible == false) {
            this.visible = true;
            this.performance();
          }
        }
      }
    });
  }

  function navigation(button) {
    if (button == 'click') {return true;}
    var activeItem = $('.itemSearch ul.items .active');
    if (button.key == 'ArrowUp') {
      $('.items').animate({ scrollTop: activeItem[0].offsetTop-130 }, 150);
      if ($('.items li').first().attr('class') !== 'active') {
        activeItem.removeClass('active');
        activeItem.prev().addClass('active');
      }
    }
    if (button.key == 'ArrowDown') {
      $('.items').animate({ scrollTop: activeItem[0].offsetTop-130 }, 150);
      if ($('.items li').last().prev().attr('class') !== 'active') {
        activeItem.removeClass('active');
        activeItem.next().addClass('active');
      }
    }
  }

});