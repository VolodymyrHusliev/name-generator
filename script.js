$(document).ready(function() {
    // Заполнение выпадающих списков данными из data.js
    verticalOptions.forEach(option => {
        $('#verticalFieldSelect').append(`<option value="${option}">${option}</option>`);
    });

    languageOptions.forEach(option => {
        $('#languageField').append(`<option value="${option.value}">${option.text}</option>`);
    });

    authorTypeOptions.forEach(option => {
        $('#authorTypeField').append(`<option value="${option.value}">${option.text}</option>`);
    });

    trafficSourceOptions.forEach(option => {
        $('#trafficSourceField').append(`<option value="${option.value}">${option.text}</option>`);
    });

    creoTypeOptions.forEach(option => {
        $('#creoTypeField').append(`<option value="${option.value}">${option.text}</option>`);
    });

    // Инициализация Select2 только для вертикали и языка (без allowClear), с dropdownParent и dropdownPosition
    $('#verticalFieldSelect').select2({
        placeholder: 'Выберите вертикаль',
        allowClear: false,
        width: '100%',
        minimumResultsForSearch: 0,
        dropdownParent: $('#creoNameGenerator'),
        dropdownPosition: 'below',
        language: {
            noResults: function() {
                return "Ничего не найдено";
            },
            searching: function() {
                return "Поиск...";
            }
        }
    });
    $('#languageField').select2({
        placeholder: 'Выберите язык',
        allowClear: false,
        width: '100%',
        minimumResultsForSearch: 0,
        dropdownParent: $('#creoNameGenerator'),
        dropdownPosition: 'below',
        language: {
            noResults: function() {
                return "Ничего не найдено";
            },
            searching: function() {
                return "Поиск...";
            }
        }
    });

    // Устанавливаем значения по умолчанию
    $('#verticalFieldSelect').val(verticalOptions[0]).trigger('change');
    $('#languageField').val('EN').trigger('change');
    $('#authorTypeField').val('D');
    $('#trafficSourceField').val('FB');
    $('#creoTypeField').val('O').trigger('change');

    // Добавляем обработчик клика для копирования результата
    $('#creoNameOutput').on('click', function() {
        const text = $(this).text();
        if (text) {
            navigator.clipboard.writeText(text).then(() => {
                // Добавляем класс для визуальной индикации
                $(this).addClass('copied');
                // Убираем класс через 1 секунду
                setTimeout(() => {
                    $(this).removeClass('copied');
                }, 1000);
            }).catch(err => {
                console.error('Ошибка при копировании: ', err);
            });
        }
    });
});

function generateCreoName() {
    try {
        // Получаем значения из полей
        let vertical = $('#verticalManualInput').val().trim();
        if (!vertical) {
            vertical = $('#verticalFieldSelect').val();
        }
        const language = $('#languageField').val();
        const author = $('#authorField').val();
        const authorType = $('#authorTypeField').val();
        const trafficSource = $('#trafficSourceField').val();
        const clickupTaskId = $('#clickupTaskIdField').val();
        const parentUniqId = $('#parentUniqIdField').val();
        const creoType = $('#creoTypeField').val();

        // Проверяем обязательные поля
        if (!vertical || !language || !author || !authorType || !trafficSource || !creoType) {
            alert('Пожалуйста, заполните все обязательные поля!');
            return;
        }

        // Получаем текущую дату и время
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        const timestamp = `${year}${month}${day}${hours}${minutes}${seconds}`;

        // Очищаем контейнер с результатами
        const resultContainer = $('#creoNamesOutput');
        resultContainer.empty();

        // Генерируем 6 уникальных имен
        for (let i = 1; i <= 6; i++) {
            // Генерируем уникальный ID (8 символов, строчные буквы)
            const uniqueId = Math.random().toString(36).substring(2, 10).toLowerCase();

            // Формируем имя CREO
            let creoName = `${uniqueId}_${vertical}_${language.toUpperCase()}_${author}_${authorType}_${trafficSource}_${timestamp}`;

            // Добавляем опциональные поля
            if (clickupTaskId) {
                creoName += `_${clickupTaskId}`;
            } else {
                creoName += '_NAN';
            }

            if (parentUniqId) {
                creoName += `_${parentUniqId}`;
            } else {
                creoName += '_NAN';
            }

            // Добавляем порядковый номер креатива
            creoName += `_${i}`;

            // Добавляем тип CREO
            creoName += `_${creoType}`;

            // Создаем контейнер для результата
            const resultItem = $('<div>').addClass('result-item');

            // Создаем блок для текста результата
            const resultText = $('<div>')
                .addClass('result-text')
                .text(creoName)
                .hide();

            // Создаем блок для результата
            const resultBox = $('<div>')
                .addClass('result-box')
                .attr('data-number', `Креатив ${i}`);

            // Создаем кнопку копирования
            const copyButton = $('<button>')
                .addClass('copy-button')
                .html('📋')
                .on('click', function(e) {
                    e.stopPropagation();
                    navigator.clipboard.writeText(creoName).then(() => {
                        $(this).addClass('copied');
                    }).catch(err => {
                        console.error('Ошибка при копировании: ', err);
                    });
                });

            // Вставляем элементы в правильном порядке
            resultBox.append(resultText);
            resultBox.append(copyButton);
            resultItem.append(resultBox);
            resultContainer.append(resultItem);

            // Показываем результат с анимацией
            resultText.fadeIn(500);
        }

        
    } catch (error) {
        console.error('Ошибка при генерации имени CREO:', error);
        alert('Произошла ошибка при генерации имени CREO. Пожалуйста, попробуйте снова.');
    }
} 