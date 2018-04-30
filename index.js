const STOCK_URL = 'https://www.alphavantage.co/query';


// Once the user clicks "I understand", renders and loads form detection for the next page.

function watchStart (){
  
  $('#startButton').click(event => {
    event.preventDefault();
    $('#start').css('display', 'none');
    $('#stocks').css('display', 'block');
    $('#displayBox').css('width', '80%');
    $('#displayBox').css('max-width', '600px');
    $('#displayBox').css('height', '350px');
    getDataFromApi();
    console.log('Start button pressed!');
    $(watchSubmit);
  });
}

// Once the submit button is pressed, sends query to API to retrieve data.

var valid ='';

function watchSubmit() {
  
  $('.js-search-form').submit(event => {
    valid = 0;
    event.preventDefault();
    const queryTarget = $(event.currentTarget).find('.js-query');
    const query = queryTarget.val();
    // clear out the input
    queryTarget.val("");
    getDataFromApi(query, renderData);
    });
}

// Builds and sends query for current price.

function getDataFromApi2(searchTerm, callback) { 
  
  const query = {
    function: 'TIME_SERIES_INTRADAY',
    symbol: `${searchTerm}`,
    apikey: 'A7J2G4WQ7OBR3CZU'
  };
  
  $.getJSON(STOCK_URL, query, callback);
}

// Builds and sends query for past day prices.

function getDataFromApi(searchTerm, callback) { 
  
  const query = {
    function: 'TIME_SERIES_DAILY',
    symbol: `${searchTerm}`,
    apikey: 'A7J2G4WQ7OBR3CZU'
  };
  
  $.getJSON(STOCK_URL, query, callback);
}

// Displays data in a box and updates the page.

function renderData(result) {
  var ticker = '';
  ticker += result["Meta Data"]["2. Symbol"];
  tickerCaps = ticker.toUpperCase();
  $('.stockBox').html(tickerCaps);
  $('.stockLink').attr('href','https://stocktwits.com/symbol/' + tickerCaps);
  console.log('Stock data retrieved');
  
  //Generates last market day's open/closing price, even if date is weekend.
  var wDate = new Date();
     
     //Code for Saturday
    if (wDate.getDay() === 6) {
      dateY = (new Date()).getFullYear() + '-' +
     ('0'+ (new Date().getMonth()+1)).slice(-2) + '-' + 
     ('0'+ (new Date().getDate() -1)).slice(-2);
     $('#closedBanner').text('(Market is closed today.)');
     $('#closedBanner').css('color','darkred');
     //Code for Sunday
    } else if (wDate.getDay() === 0) {
      dateY = (new Date()).getFullYear() + '-' +
     ('0'+ (new Date().getMonth()+1)).slice(-2) + '-' + 
     ('0'+ (new Date().getDate() -2)).slice(-2);
     $('#closedBanner').text('(Market is closed today.)');
     $('#closedBanner').css('color','darkred');
     //Code for every other day
    } else { dateY = (new Date()).getFullYear() + '-' +
     ('0'+ (new Date().getMonth()+1)).slice(-2) + '-' + 
     ('0'+ (new Date().getDate())).slice(-2);
     $('#closedBanner').text('(Market is open today!)');
     $('#closedBanner').css('color','darkgreen');}
     
    //Generates the abbreviated day of the week next to date in price statement.
    
    if (wDate.getDay() === 0) {
      daySnip = 'Fri';
    } else if (wDate.getDay() === 1) {
      daySnip ='Mon';
    } else if (wDate.getDay() === 2) {
      daySnip ='Tue';
    } else if (wDate.getDay() === 3) {
      daySnip ='Wed';
    } else if (wDate.getDay() === 4) {
      daySnip ='Thu';
    } else if (wDate.getDay() === 5) {
      daySnip ='Fri';
    } else {
      daySnip ='Fri';
    }
     
    var price1 = '';
    if (dateY === (new Date()).getFullYear() + '-' +
     ('0'+ (new Date().getMonth()+1)).slice(-2) + '-' + 
     ('0'+ (new Date().getDate())).slice(-2)) {
       price1 += result["Time Series (Daily)"][dateY]["1. open"];
       $('#prices').text(dateY + '/' + daySnip + ": " + ticker.toUpperCase() + " opened at $" + price1.slice(0, -2) + ' today. Goooo' + ticker.toUpperCase() + '!');
    } else price1 += result["Time Series (Daily)"][dateY]["4. close"];
     var volume= '';
     volume += result["Time Series (Daily)"][dateY]["5. volume"];
     $('#prices').text(dateY + '/' + daySnip + ": " + ticker.toUpperCase() + " closed at $" + price1.slice(0, -2) + ' and ' + volume + ' shares were sold.');

  console.log(dateY + ":closing price was " + price1);
  console.log(dateY + ":volume was " + volume + " shares sold.");
    
  renderBox();
}

// Updates various elements to display new data.

function renderBox() {
  $('.stockBox').css('display','block');
  $('#searchLabel').css('display','none');
  $('#query').attr('placeholder','Search Again?');
  $('#clickText').css('display','block');
  $('#priceSet').css('display', 'block');
}

$(watchStart);

