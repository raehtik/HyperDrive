const STOCK_URL = 'https://www.alphavantage.co/query';


// Once the user clicks "I understand", renders and loads form detection for the next page.

function watchStart (){
  
  $('#startButton').click(event => {
    event.preventDefault();
    $('#start').css('display', 'none');
    $('#stocks').css('display', 'block');
    $('#displayBox').css('width', '80%');
    $('#displayBox').css('max-width', '600px');
    $('#displayBox').css('height', 'auto');
    getDataFromApi();
    console.log('Start button pressed!');
    $(watchSubmit);
  });
}

// Once the submit button is pressed, sends query to API to retrieve data.

function watchSubmit() {
  
  $('.js-search-form').submit(event => {
    event.preventDefault();
    const queryTarget = $(event.currentTarget).find('.js-query');
    const query = queryTarget.val();
    // clear out the input
    queryTarget.val("");
    getDataFromApi(query, renderData);
    $('#displayBox').css('display', 'none');
    $('#loadScreen').css('display', 'block');
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

  if (result["Error Message"]) {
    $('#displayBox').css('display', 'block');
    $('#loadScreen').css('display', 'none');
    $('.stockBox').css('display', 'block');
    $('.stockBox').css('background-color', 'darkred');
    $('.stockBox').html(`Oops! <br> No data found.`);
    $('.stockBox').css('padding', '32px 0 0 0');
    $('#priceSet').css('display', 'none');
  } else {
  $('#displayBox').css('display', 'block');
  $('#loadScreen').css('display', 'none');
  var ticker = '';
  ticker += result["Meta Data"]["2. Symbol"].toUpperCase();
  $('.stockBox').text(ticker);
  $('.stockLink').attr('href','https://stocktwits.com/symbol/' + ticker);
  console.log('Stock data retrieved');
  
  //Generates the day of the week.
    
    var wDate = new Date();
    
    if (wDate.getDay() === 0) {
      daySnip = 'Friday';
      dayFull = 'Sunday';
      dayBefore = 'Friday';
    } else if (wDate.getDay() === 1) {
      daySnip = 'Monday';
      dayFull = 'Monday';
      dayBefore = 'Friday';
    } else if (wDate.getDay() === 2) {
      daySnip = 'Tuesday';
      dayFull = 'Tuesday';
      dayBefore = 'Monday';
    } else if (wDate.getDay() === 3) {
      daySnip = 'Wednesday';
      dayFull = 'Wednesday';
      dayBefore = 'Tuesday';
    } else if (wDate.getDay() === 4) {
      daySnip = 'Thursday';
      dayFull = 'Thursday';
      dayBefore = 'Wednesday';
    } else if (wDate.getDay() === 5) {
      daySnip = 'Friday';
      dayFull = 'Friday';
      dayBefore = 'Thursday'
    } else {
      daySnip = 'Friday';
      dayFull = 'Saturday';
      dayBefore = 'Friday'
    }
    
     //Generates last market day's open/closing price, even if date is weekend.
     
     //Code for Saturday
            //Retrieves the number for the 'day of the week'
    if (wDate.getDay() === 6) {
            //generates today's date in default format and retrieves the year portion
      dateY = (new Date()).getFullYear() + '-' +
            //Then retrieves the month portion ('0' is added before this portion to mimic ISO 8601 time format (+1 because months start at '0') (.slice(-2) because if we prepend '0' to a month like '10' or '11', we get three digits instead of two)
     ('0'+ (new Date().getMonth()+1)).slice(-2) + '-' + 
            //Retrieves the day portion and subtracts '1' to mimic Friday's date (markets are closed on Saturday).
     ('0'+ (new Date().getDate() -1)).slice(-2);
     
     $('#closedBanner').text('(' + dayFull + ': Market is closed today.)');
     $('#closedBanner').css('color','darkred');
     
     //Code for Sunday
    } else if (wDate.getDay() === 0) {
      dateY = (new Date()).getFullYear() + '-' +
     ('0'+ (new Date().getMonth()+1)).slice(-2) + '-' + 
     ('0'+ (new Date().getDate() -2)).slice(-2);
     $('#closedBanner').text('(' + dayFull + ': Market is closed today.)');
     $('#closedBanner').css('color','darkred');
     
     //Code for every other day
    } else { dateY = (new Date()).getFullYear() + '-' +
     ('0'+ (new Date().getMonth()+1)).slice(-2) + '-' + 
     ('0'+ (new Date().getDate())).slice(-2);
     $('#closedBanner').text('(' + dayFull + ': Market is open today!)');
     $('#closedBanner').css('color','darkgreen');}
     
    //Generates price and message, accounting for market times and dates. 
    $('#dateStamp').text(dateY + '/' + daySnip);
    if (new Date().getUTCHours() >= 21 || new Date().getUTCHours() <= 14) {
      dateY = (new Date()).getFullYear() + '-' +
     ('0'+ (new Date().getMonth()+1)).slice(-2) + '-' + 
     ('0'+ (new Date().getDate() -1)).slice(-2);
    } else {
      dateY = (new Date()).getFullYear() + '-' +
     ('0'+ (new Date().getMonth()+1)).slice(-2) + '-' + 
     ('0'+ (new Date().getDate())).slice(-2);
    }
    var price1 = result["Time Series (Daily)"][dateY]["1. open"];
    var price2 = result["Time Series (Daily)"][dateY]["4. close"];
    var volume = result["Time Series (Daily)"][dateY]["5. volume"];
    var perc = Math.abs((((price1/price2)-1)*100).toFixed(2));
    
    //Generates a price movement direction and percentage based on opening and closing price.
    var directionText = '';
    
    //Flavor text based on price movement
    if (price1 > price2) {
      directionText = 'Aw.. ';
      directionBlurb = ' went down by ';
      $('#movement').css('color','darkred');
    } else if (price1 < price2) {
      directionText = 'Yes!! ';
      directionBlurb = ' rose by ';
      $('#movement').css('color','darkgreen');
    } else {
      directionText ='How boring. ';
      directionBlurb = ' made no change, at ';
    }
    
    //We'll give you an open, a close price, and shares sold depending on what time it is.
    if (dateY === (new Date()).getFullYear() + '-' +
     ('0'+ (new Date().getMonth()+1)).slice(-2) + '-' + 
     ('0'+ (new Date().getDate())).slice(-2)) {
       
       //Generate opening price.
       $('#prices').text(ticker + " opened at $" + price1.slice(0, -2) + ' today. Gooo ' + ticker + '!');
       
       //Generate closing price and volume sold *if* the market is closed.
       if (new Date().getUTCHours() >= 21 || new Date().getUTCHours() <= 14) {
        $('#prices2').text(ticker + " closed at $" + price2.slice(0, -2) + ' and ' + volume + ' shares were sold.');
        $('#movement').text(directionText + ticker + directionBlurb + perc + '%!');
       }
     
      //Unless it's a weekend, then we'll just give you the information for Friday.
      } else { 
        $('#prices').text(ticker + " opened at $" + price1.slice(0, -2) + ' on ' + dayBefore + '. Gooo ' + ticker + '!');
        $('#prices2').text(ticker + " closed at $" + price2.slice(0, -2) + ' and ' + volume + ' shares were sold.');
        $('#movement').text(directionText + ticker + directionBlurb + perc + '%!');
      }

  console.log(dateY + ":opening price was " + price1);
  console.log(dateY + ":closing price was " + price2);
  console.log(dateY + ":volume was " + volume + " shares sold.");
    
  renderBox();
  $('#virtPortButton').css('display', 'block');
  }
}

// Updates various elements to display new data.

function renderBox() {
  $('.stockBox').css('display', 'block');
  $('.stockBox').css('padding', '40px 0 0 0');
  $('.stockBox').css('background-color', '#0a3e5e');
  $('#searchLabel').css('display', 'none');
  $('#query').attr('placeholder', 'Search Again?');
  $('#clickText').css('display', 'block');
  $('#priceSet').css('display', 'block');
}

$(watchStart);

