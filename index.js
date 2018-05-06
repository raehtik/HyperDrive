//AlphaVantage API base
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
     $(watchSubmit);
  });
}

// Watches for user search
function watchSubmit() {
  
  $('#js-search-form').submit(event => {
    event.preventDefault();
    const queryTarget = $(event.currentTarget).find('.js-query');
    const query = queryTarget.val();
    queryTarget.val("");
     getDataFromApi(query, renderData);
    $('#displayBox').css('display', 'none');
    $('#loadScreen').css('display', 'block');
    });
}

// (AlphaVantage) Builds and sends query for relevant prices.
function getDataFromApi(searchTerm, callback) {

  const query = {
    function: 'TIME_SERIES_DAILY',
    symbol: `${searchTerm}`,
    apikey: 'A7J2G4WQ7OBR3CZU'
  };
  
  $.getJSON(STOCK_URL, query, callback);
}

//Generates the effective trade day of the week
function getTradeDate() {
   
    var wDate = new Date();
    
    //If today is Sunday
    if (wDate.getDay() === 0) {
      
      daySnip = 'Friday';
      dayFull = 'Sunday';
      dayBefore = 'Friday';

    //..Monday
    } else if (wDate.getDay() === 1) {

      daySnip = 'Monday';
      dayFull = 'Monday';
      dayBefore = 'Friday';

    //..Tuesday, and so on
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
      dayBefore = 'Friday';

    }
    
    //Retrieves the number for the 'day of the week'

    //Code for Saturday
    if (wDate.getDay() === 6) {

    //Generates today's date in default format and retrieves the year portion
    dateY = (new Date()).getFullYear() + '-' +

     //..then retrieves the month portion ('0' is added before this portion to mimic ISO 8601 time format (+1 because months start at '0') (.slice(-2) because if we prepend '0' to a month like '10' or '11', we get three digits instead of two)
     ('0'+ (new Date().getMonth()+1)).slice(-2) + '-' + 

     //..then retrieves the day portion and subtracts '1' to mimic Friday's date (markets are closed on Saturday).
     ('0'+ (new Date().getDate() -1)).slice(-2);
     
     //..and finally sets our display to reflect a closed market.
     $('#closedBanner').text('(' + dayFull + ': Market is closed today.)');
     $('#closedBanner').css('color','darkred');
     
     //Code for Sunday
    } else if (wDate.getDay() === 0) {

     dateY = (new Date()).getFullYear() + '-' +
     ('0'+ (new Date().getMonth()+1)).slice(-2) + '-' + 
     ('0'+ (new Date().getDate() -2)).slice(-2);
     $('#closedBanner').text('(' + dayFull + ': Market is closed today.)');
     $('#closedBanner').css('color','darkred');
     $('#dateStamp').text(dateY + '/' + daySnip);
     
     //Code for weekdays
    } else {

     dateY = (new Date()).getFullYear() + '-' +
     ('0'+ (new Date().getMonth()+1)).slice(-2) + '-' + 
     ('0'+ (new Date().getDate())).slice(-2);
     $('#closedBanner').text('(' + dayFull + ': Market is open today!)');
     $('#closedBanner').css('color','darkgreen');
     $('#dateStamp').text(dateY + '/' + daySnip);
     
    //Weekday, but market is closed
    if (new Date().getUTCHours() >= 21 || new Date().getUTCHours() <= 14) {

      dateY = (new Date()).getFullYear() + '-' +
     ('0'+ (new Date().getMonth()+1)).slice(-2) + '-' + 
     ('0'+ (new Date().getDate() -1)).slice(-2);
     $('#dateStamp').text(dateY + '/' + daySnip);

    //Otherwise, weekday and market is open
    } else {

      dateY = (new Date()).getFullYear() + '-' +
     ('0'+ (new Date().getMonth()+1)).slice(-2) + '-' + 
     ('0'+ (new Date().getDate())).slice(-2);
    }
  }
}

//Generates price/shares based on effective trade date
function renderData(result) {

  getTradeDate();

  //If no data is found..
  if (result["Error Message"]) {

    //..set display to error message.
    $('#displayBox').css('display', 'block');
    $('#loadScreen').css('display', 'none');
    $('#stockBox').css('display', 'block');
    $('#stockBox').css('width', '100px');
    $('#clickText').css('display', 'none');
    $('#clickText2').css('display', 'none');
    $('#stockBox').css('background-color', 'darkred');
    $('#stockBox').html(`Oops! <br> No data found.`);
    $('#stockLink').attr('href','javascript: void(0)');
    $('#stockBox').css('padding', '32px 0 0 0');
    $('#priceSet').css('display', 'none');

  //Or if data is found, but the stock is unavailable..
  } else if (result["Time Series (Daily)"][dateY] == undefined){

    var ticker = result["Meta Data"]["2. Symbol"].toUpperCase();
    var tDate = result["Meta Data"]["3. Last Refreshed"];
    var tPrice = result["Time Series (Daily)"][tDate]["4. close"].slice(0, -2);

    //..inform user of stock being delisted.
    $('#displayBox').css('display', 'block');
    $('#loadScreen').css('display', 'none');
    $('#clickText').css('display', 'block');
    $('#clickText2').css('display', 'block');
    $('#clickText').text(ticker + ' does exist, but was last traded on ' + tDate);
    $('#clickText2').text('(If it helps, ' + ticker + ' used to sell for $' + tPrice + ' a share.)');
    $('#stockLink').attr('href','javascript: void(0)');
    $('#stockBox').css('display', 'block');
    $('#stockBox').css('font-size', '16px');
    $('#stockBox').css('width', '150px');
    $('#stockBox').css('background-color', '#bc5e12');
    $('#stockBox').text('Oh No! That stock is no longer available!');
    $('#stockBox').css('padding', '32px 0 0 0');
    $('#priceSet').css('display', 'none');

  //But if the symbol is good and valid data is found..
  }  else {

    //..engage HyperDrive!
    var ticker = result["Meta Data"]["2. Symbol"].toUpperCase();
    $('#displayBox').css('display', 'block');
    $('#loadScreen').css('display', 'none');
    $('#stockBox').text(ticker);
    $('#stockLink').attr('href','https://stocktwits.com/symbol/' + ticker);
  
    var price1 = result["Time Series (Daily)"][dateY]["1. open"];
    var price2 = result["Time Series (Daily)"][dateY]["4. close"];
    var volume = result["Time Series (Daily)"][dateY]["5. volume"];
    var perc = Math.abs((((price1/price2)-1)*100).toFixed(2));
    
    //Generates a price movement direction and percentage message based on opening and closing price.
    var directionText = '';
    
    //Negative movement
    if (price1 > price2) {

      directionText = 'Aw.. ';
      directionBlurb = ' went down by ';
      $('#movement').css('color','darkred');
    
    //Positive movement
    } else if (price1 < price2) {

      directionText = 'Yes!! ';
      directionBlurb = ' rose by ';
      $('#movement').css('color','darkgreen');

    //No movement
    } else {

      directionText ='How boring. ';
      directionBlurb = ' made no change, at ';
  }
    
    //If it's a weekday,
    if (dateY === (new Date()).getFullYear() + '-' +
     ('0'+ (new Date().getMonth()+1)).slice(-2) + '-' + 
     ('0'+ (new Date().getDate())).slice(-2)) {
       
       //..generate opening price.
       $('#prices').text(ticker + " opened at $" + price1.slice(0, -2) + ' today. Gooo ' + ticker + '!');
       
       //..and generate closing price and volume sold *if* the market is closed.
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

  renderBox();
  $('#virtPortButton').css('display', 'block');
  }
}

// Updates page to display new data.
function renderBox() {

  $('#stockBox').css('display', 'block');
  $('#stockBox').css('width', '100px');
  $('#stockBox').css('padding', '40px 0 0 0');
  $('#stockBox').css('background-color', '#0a3e5e');
  $('#searchLabel').css('display', 'none');
  $('#query').attr('placeholder', 'Search Again?');
  $('#clickText').css('display', 'block');
  $('#clickText').text('Click box for Stocktwits page.');
  $('#clickText2').css('display', 'none');
  $('#priceSet').css('display', 'block');
}

$(watchStart);