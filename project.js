
$(document).ready(function () {
var linkpp;
$("div").hide();
$('#playbtn').click(function(){
  $("div").show();
  $('#playbtn').hide();
});


    $.ajax ({
      method: 'GET',
      url: 'https://api.unsplash.com/photos/random/?client_id=378e5c358a93bb4df9b111a88c74ca31069650c5c02489ee7a5bd578108f0b27',
      success: function(result){
          console.log(result);
        // 
      im= result.urls.regular;
      linkpp='\''+im+'\'';
      console.log(im);
      console.log(linkpp);
      
        //  $('body').css('background-image', 'url(' + result.urls.regular + ')');
          var puz1 = new PuzzleImg('puz1', im, 5, 5, 400, 400);
        
      },
      error:function(result){
          console.log(error)
      }
      
    
    })

    function PuzzleImg(id_p, im, cols, rows, wg, hg){
      console.log(im);
 me=this;
      var img ='';  //image object
      var cnt ='';  //canvas content obj.
      var width = wg ? wg :'';  //canvas width. If empty, will have the width of image
      var height = hg ? hg :'';  //canvas height. If empty, will have the height of image
      var id_solv ='';  //ID of button to solve puzzle
      var cols = cols;
      var rows = rows;
      var p_size ='';  //obj. sizes of image piece
      var tl_size =''; //obj. sizes of tiles in canvas
      var im_p = [];  //array with objects with coords of image pieces {px,py, tx,ty,id}. Set 0 after puzzle completed
      var tl_p = [];  //object with tiles to draw in canvas id:{px,py, tx,ty, ord}
      var tl_h =-1;  //ids of hovered tile
      var tl_c =-1;  //ids of 1st clicked tile of two (-1 from start)
      var solv =0;  //1 when puzzle is solved, -1 when is solved from button
      me.clicks =0;  //nr clicks
    
      //set <canvas> in $div, and properties: $cnv, $cnt, $img, $p_size, $tl_size
      console.log(im);
      function setElms(id_p, im){
          console.log(im);    
        //set1 properties
        img = im;
        if(width =='') width = img.width;
        if(height =='') height = img.height;
    
        //add canvas and solve button
        var parent = document.getElementById(id_p);
        id_solv = id_p +'_solv';
       
        var parent = document.querySelector('#puz1'); //نجيب الديف اللي بنضيف عليها 
        
        /// ننشئ كانفاس
        var can1 = document.createElement('canvas'); 
        can1.setAttribute('id',id_p +'_cnv');
        can1.setAttribute('width',width);
        can1.setAttribute('height',height);
        can1.setAttribute('class','puzcnv');
        console.log(parent)
        parent.appendChild(can1); 
        /// ننشئ صورة
        var pic1 =document.createElement('img');
        pic1.setAttribute('src',linkpp);
        pic1.setAttribute('width',width/3);
        pic1.setAttribute('height',height/3);
        pic1.setAttribute('class','puzimg')
        parent.appendChild(pic1); 
     
      var btn =document.createElement('button');
        btn.setAttribute('id',id_p +'_solv')
        btn.setAttribute('class','puzsolve')
        $(btn).text('solve')

     //   btn.text('solve')
        
        parent.appendChild(btn); 
    

         parent.style.width = width +2 +'px';;
       
    
        //set2 properties
        var cnv = document.getElementById(id_p +'_cnv');
        cnt = cnv.getContext('2d');
        console.log(img);
        p_size = {w:img.naturalWidth /cols, h:img.naturalHeight /rows}; 
        tl_size = {w:width /cols, h:height /rows};
    
        setImP();  //set image pieces
    
        //register click event
        cnv.addEventListener('click', function(ev){
          if(solv ==0){ //if not completed
          me.clicks++;
            var x = ev.offsetX;
            var y = ev.offsetY;
    
            //detect clicked tile from $tl_p
            for(var id in tl_p){
              if(y > tl_p[id].ty && y < tl_p[id].ty + tl_size.h && x > tl_p[id].tx && x < tl_p[id].tx + tl_size.w){
                //if 1st tile, add id in $tl_c and draw border, else, swap tiles
                if(tl_c ==-1){
                  tl_c = id;
                  drawB(2, '#f00', id);
                }
                else {
                  var tl2 = {tx:tl_p[id].tx, ty:tl_p[id].ty, ord:tl_p[id].ord};//data of 2nd tile to be added in 1st tile
                  tl_p[id] = {px:tl_p[id].px, py:tl_p[id].py, tx:tl_p[tl_c].tx, ty:tl_p[tl_c].ty, ord:tl_p[tl_c].ord, id:id};  //2nd tl
                  tl_p[tl_c] = {px:tl_p[tl_c].px, py:tl_p[tl_c].py, tx:tl2.tx, ty:tl2.ty, ord:tl2.ord, id:tl_c};  //1st tl
                  drawTL(tl_p);
                  tl_c =-1;
                }
                break;
              }
            }
          }
        });
    
        //on mousemove
        cnv.addEventListener('mousemove', function(ev){
          if(solv ==0){ //if not completed
            var x = ev.offsetX;
            var y = ev.offsetY;
    
            //detect clicked tile from $tl_p
            for(var id in tl_p){
              if(y > tl_p[id].ty && y < tl_p[id].ty + tl_size.h && x > tl_p[id].tx && x < tl_p[id].tx + tl_size.w){
                //if other tile mousemove
                if(tl_h != id){
                  tl_h = id;
                  drawTL(tl_p);
                  if(tl_c !=-1) drawB(2, '#f00', tl_c);  //for clicked
                  drawB(2, '#f8f900', id);
                }
                break;
              }
            }
          }
        });
    
        //click to solve puzzle
        document.getElementById(id_solv).addEventListener('click', function(){
          if(id_solv !=''){ solv =-1; drawTL(im_p);}
        });
      }
    
      //get image pieces from $img and set it in $im_p
      function setImP(){
        for(var i=0; i<cols * rows; ++i) {
          var c = Math.floor(i /rows);  var r = i %rows;  //current column /rom of piece in img
          //add in $im_p object with positions of pieces in image
          im_p.push({px:c *p_size.w, py:r * p_size.h, tx:c *tl_size.w, ty:r *tl_size.h, id:i});
        }
        for(var j, x, i = im_p.length; i; j = Math.floor(Math.random() * i), x = im_p[--i], im_p[i] = im_p[j], im_p[j] = x);  //shuffle array
        setTL();  //set canvas tiles
      }
    
      //set tiles in $tl_p from $im_p
      function setTL(){
        for(var i=0; i<im_p.length; i++){
          var c = Math.floor(i /rows);  var r = i %rows;  //current column /rom of tile in canvas
          tl_p[im_p[i].id] = {px:im_p[i].px, py:im_p[i].py, tx:c *tl_size.w, ty:r *tl_size.h, ord:i};
        }
        drawTL(tl_p);  //draw tiles in canvas
      }
    
      //draw tiles from $tls
      function drawTL(tls){
        for(var id in tl_p){
          cnt.drawImage(img, tls[id].px, tls[id].py, p_size.w, p_size.h, tls[id].tx, tls[id].ty, tl_size.w, tl_size.h);
        }
        checkPuzzle();  //check if puzzle completed
      }
    
      //check if tiles are in correct order, else 0
      function checkPuzzle(){
        var re =1;
        if(solv ==0){
          for(var id in tl_p){
            if(id !=tl_p[id].ord){ re =0; break;}
          }
        }
        if(re ==1){
          cnt.drawImage(img, 0, 0, width, height);
    
          //if solved manually (-1 is auto) calls solved()
          if(solv ==0){
            solv =1;
          me.solved();
          }
        }
      }
    
      //to draw border with size $sz and color $cl around tile with $id
      function drawB(sz, cl, id){
        cnt.lineWidth = sz;
        cnt.strokeStyle = cl;
        cnt.strokeRect(tl_p[id].tx +1, tl_p[id].ty +1, tl_size.w -2, tl_size.h -2);
      }
    
      //remove button that solves the puzzle
      me.delSolve = function(){ document.getElementById(id_solv).outerHTML =''; id_solv ='';}
    
      //called when puzzle is completed
      me.solved = function(){ if(me.clicks >0) alert('Congratulations, you solved the puzzle in '+ me.clicks +' clicks');}
    
      //if $im is string (image address) create object image and calls setElms(), else setElms()'
      if(typeof im =='string'){
        img = new Image();
        img.onload = function(){ setElms(id_p, img);};
        linkpp=im;
        
        console.log(img.src)
        
       img.src = linkpp;
  // img.appendChild('scr',linkpp);
       console.log(img.src)
      

      }
      else {
       im.outerHTML ='<div id="'+ id_p +'e" class="puzelm"></div>';  //parent for canvas
        setElms(id_p +'e', im);
      }
    }
    
    })

   

    