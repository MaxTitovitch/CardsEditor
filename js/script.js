let queue = null, id = 0, connectedIds = [];

let clearQueue = function () {
    queue = null;
    $('.outline').toArray().forEach(function (element) {
      $(element).removeClass('outline')
    });
}

let createDragListener = function (x, y, line) {
  return function (event) {
    let position = $(this).position()
    line.setAttribute(x, position.left + $(this).width()/2);
    line.setAttribute(y, position.top + $(this).height()/2);
  }
}

let isExistId = function (id1, id2) {
  return connectedIds.lastIndexOf(id1 + '-' + id2) === -1 && connectedIds.lastIndexOf(id2 + '-' + id1) === -1
}

let cardConectHundler = function(event){
    if(event.ctrlKey == true){
      $(this).addClass('outline');
      if(queue == null) {
        queue = $(this);
      } else {
        if (isExistId(queue.data('id'),$(this).data('id'))){
          var newLine = document.createElementNS('http://www.w3.org/2000/svg','line');
          newLine.setAttribute('style', 'stroke-width:2');
          newLine.setAttribute('x1', Number.parseInt(queue.css('left').replace('px', '')) + queue.width()/2);
          newLine.setAttribute('y1',Number.parseInt(queue.css('top').replace('px', ''))+ queue.height()/2);
          newLine.setAttribute('x2', Number.parseInt($(this).css('left').replace('px', '')) + $(this).width()/2);
          newLine.setAttribute('y2',Number.parseInt($(this).css('top').replace('px', ''))+ $(this).height()/2);
          newLine.setAttribute("stroke", "#007bff")
          $("#svgLines").append(newLine);
          queue.on( 'pointerMove', createDragListener('x1', 'y1', newLine));
          $(this).on( 'pointerMove', createDragListener('x2', 'y2', newLine));
          connectedIds.push(queue.data('id') + '-' + $(this).data('id'));
          clearQueue();
        }
      }
    }
};


$(document).keyup(function (event) {
  if(event.code == 'ControlLeft' || event.code == 'ControlRight'){
    clearQueue();
  }
})


$('#addCardButton').click(function (event) {
  var card = $(`
      <div class="card drag" data-id="${id++}">
        <div class="card-handle bg-dark"></div>
        <div class="card-text"><div><span contenteditable="true"></span></div></div>
      </div>
  `);
  card.draggabilly({
    containment:true,
    handle: '.card-handle'
  });
  $('#scrollArea').append(card);
  card.css({
    position: 'absolute',
    top: document.body.offsetHeight/2 - card.height()/2,
    left: document.body.offsetWidth/2 - card.width()/2,
  });
  card.click(cardConectHundler);
});
