axios.get('js/kladr.json')
  .then(({ data })=> {
    beginBrain(data, false);
  })
  .catch((err)=> {
    var data = { 0: false };
    beginBrain(data, true);
    console.log( "Server error: look at your Internet connection." );
  });

  /*
   * Запуск автокомплита
   */
  function beginBrain(data, isError, first = true) {
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
     * -- filteredResultList             - Массив с отобранными данными
     * -- countSearch        - Количество найденных
     * -- countAll           - Полное количество элементов в базе
     * -- visible            - Активатор вывода дочернего блока
     * -- visibleMessage     - Активатор вывода сообщения
     * -- visibleItemsSearch - Активатор вывода списка найденных данных
     *
     * @methods:
     * -- findMatchingElements        - Основная функция обработки данных, находит
     *                         совпавшие элементы, выводит/скрывает сообщения
     * -- choseItem          - Выбор элемента из списка найденных
     * -- revertVisible      - Переключатель видимости всего дочернего блока
     */
    new Vue({
      el: "#app",
      data: {
        inputStatus: 0,

        message: '',
        messageIfError: '',
        messageNoResults: 'Ничего не найдено',

        filteredResultList: { 0: 'none' },

        countSearch: 0,
        countAll: 0,

        visible: false,
        visibleMessage: false,
        visibleItemsSearch: false,

        first: first,
        json_array: data
      },
      created: function () {
        window.addEventListener('keyup', this.findMatchingElements());
        if (isError) {
          this.messageIfError = 'Что-то пошло не так. Проверьте соединение с интернетом и попробуйте еще раз.';
        }
      },
      methods: {
        findMatchingElements: function(button = 'click') {

          navigation(button);

          /*
           * Если нажат Enter выбирается активный пункт 
           * из посказки и за тем скрывается подсказка
           */
          if (button.key == 'Enter') {
            this.message = domSelector('.itemSearch ul.items .active')[0].innerText;
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
             * выводится сообщение "Ничего не найдено"
             */
            if (!query_array.length) {
              if (message.length) {
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
          if (this.first) {
            this.first = false;
            this.visible = false;
          } else {
            this.visible = true;
          }
          /* --- Конец кода -- */

          this.filteredResultList = query_array;
        },
        choseItem: function(object) {
          this.message = object.originalTarget.innerText;
          this.visible = false;
        },
        revertVisible: function() {
          this.visible = !this.visible;
        },
        closeVisible: function() {
            this.visible = false;
        },
        openItems: function() {
          if (!this.visible) {
            this.visible = true;
            this.findMatchingElements();
          }
        }
      }
    });
  }

  function navigation(button) {
    if (button == 'click') {return true;}

    var wrapdiv = domSelector('.itemSearch ul.items')[0];
    var prevItem = domSelectorPrev('.itemSearch ul.items .active');
    var activeItem = domSelector('.itemSearch ul.items .active');
    var nextItem = domSelectorNext('.itemSearch ul.items .active');
    var firstElement = domSelectorFirst('.itemSearch ul.items');

    if (button.key == 'ArrowUp') {
      if (firstElement.className !== 'active') {
        wrapdiv.scrollTop = nextItem.offsetTop - 150;
        removeClass(activeItem, 'active');
        addClass(prevItem, 'active');
      }
    }
    if (button.key == 'ArrowDown') {
      if (nextItem.classList[0] !== 'message') {
        wrapdiv.scrollTop = nextItem.offsetTop - 150;
        removeClass(activeItem, 'active');
        addClass(nextItem, 'active');
      }
    }
  }

  function domSelector(value) {
    return document.querySelectorAll(value);
  }


  function domSelectorNext(value = value) {
    return document.querySelectorAll(value)[0].nextElementSibling;
  }
  function domSelectorPrev(value = value) {
    return document.querySelectorAll(value)[0].previousElementSibling;
  }


  function domSelectorFirst(value = value) {
    return document.querySelectorAll(value)[0].firstElementChild;
  }
  function domSelectorLast(value = value) {
    return document.querySelectorAll(value)[0].lastElementChild;
  }


  function addClass(element, className) {
    return element.classList.add(className);

  }
  function removeClass(element, className = 'active') {
    return element[0].classList.remove(className);

  }
