console.clear();

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight / 0.8,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer({
  antialias: true,
});

renderer.setClearColor(new THREE.Color("rgb(0,0,0)"));

renderer.setSize(window.innerWidth, window.innerHeight * 0.8);

camera.position.z = 1.8;

const controls = new THREE.TrackballControls(camera, renderer.domElement);
controls.noPan = true;
controls.maxDistance = 3;
controls.minDistance = 0.7;

// 物体
const group = new THREE.Group();
scene.add(group);

let heart = null;
let sampler = null;
let originHeart = null;
const maxZ = 0.23;
const rateZ = 0.5;
new THREE.OBJLoader().load(
  "https://assets.codepen.io/127738/heart_2.obj",
  (obj) => {
    heart = obj.children[0];
    heart.geometry.rotateX(-Math.PI * 0.5);
    heart.geometry.scale(0.04, 0.04, 0.04);
    heart.geometry.translate(0, -0.4, 0);
    group.add(heart);

    heart.material = new THREE.MeshBasicMaterial({
      color: new THREE.Color("rgb(0,0,0)"),
    });
    originHeart = Array.from(heart.geometry.attributes.position.array);
    
    sampler = new THREE.MeshSurfaceSampler(heart).build();
    
    init();
    
    renderer.setAnimationLoop(render);
  }
);

let positions = [];
let colors = [];
const geometry = new THREE.BufferGeometry();

const material = new THREE.PointsMaterial({
  vertexColors: true, // Let Three.js knows that each point has a different color
  size: 0.009,
});

const particles = new THREE.Points(geometry, material);
group.add(particles);

const simplex = new SimplexNoise();
const pos = new THREE.Vector3();
const palette = [
  new THREE.Color("#ffd4ee"),
  new THREE.Color("#ff77fc"),
  new THREE.Color("#ff77ae"),
  new THREE.Color("#ff1775"),
];
class SparkPoint {
  constructor() {
    sampler.sample(pos);
    this.color = palette[Math.floor(Math.random() * palette.length)];
    this.rand = Math.random() * 0.03;
    this.pos = pos.clone();
    this.one = null;
    this.two = null;
  }
  update(a) {
    const noise =
      simplex.noise4D(this.pos.x * 1, this.pos.y * 1, this.pos.z * 1, 0.1) +
      1.5;
    const noise2 =
      simplex.noise4D(this.pos.x * 500, this.pos.y * 500, this.pos.z * 500, 1) +
      1;
    this.one = this.pos.clone().multiplyScalar(1.01 + noise * 0.15 * beat.a);
    this.two = this.pos
      .clone()
      .multiplyScalar(1 + noise2 * 1 * (beat.a + 0.3) - beat.a * 1.2);
  }
}

let spikes = [];
function init(a) {
  positions = [];
  colors = [];
  for (let i = 0; i < 10000; i++) {
    const g = new SparkPoint();
    spikes.push(g);
  }
}

const beat = { a: 0 };
gsap
  .timeline({
    repeat: -1,
    repeatDelay: 0.3,
  })
  .to(beat, {
    a: 0.5,
    duration: 0.6,
    ease: "power2.in",
  })
  .to(beat, {
    a: 0.0,
    duration: 0.6,
    ease: "power3.out",
  });

// 0.22954521554974774 -0.22854083083283794

function render(a) {
  positions = [];
  colors = [];
  spikes.forEach((g, i) => {
    g.update(a);
    const rand = g.rand;
    const color = g.color;
    if (maxZ * rateZ + rand > g.one.z && g.one.z > -maxZ * rateZ - rand) {
      positions.push(g.one.x, g.one.y, g.one.z);
      colors.push(color.r, color.g, color.b);
    }
    if (
      maxZ * rateZ + rand * 2 > g.one.z &&
      g.one.z > -maxZ * rateZ - rand * 2
    ) {
      positions.push(g.two.x, g.two.y, g.two.z);
      colors.push(color.r, color.g, color.b);
    }
  });
  geometry.setAttribute(
    "position",
    new THREE.BufferAttribute(new Float32Array(positions), 3)
  );

  geometry.setAttribute(
    "color",
    new THREE.BufferAttribute(new Float32Array(colors), 3)
  );

  const vs = heart.geometry.attributes.position.array;
  for (let i = 0; i < vs.length; i += 3) {
    const v = new THREE.Vector3(
      originHeart[i],
      originHeart[i + 1],
      originHeart[i + 2]
    );
    const noise =
      simplex.noise4D(
        originHeart[i] * 1.5,
        originHeart[i + 1] * 1.5,
        originHeart[i + 2] * 1.5,
        a * 0.0005
      ) + 1;
    v.multiplyScalar(0 + noise * 0.15 * beat.a);
    vs[i] = v.x;
    vs[i + 1] = v.y;
    vs[i + 2] = v.z;
  }
  heart.geometry.attributes.position.needsUpdate = true;

  controls.update();
  renderer.render(scene, camera);
}

window.addEventListener("resize", onWindowResize, false);
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight / 0.8;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight * 0.8);
}

$(document).ready(function() {
  // process bar
  setTimeout(function() {
      firstQuestion();
      $(".container").fadeOut(1);
      $('.spinner').fadeOut();
      $('#preloader').delay(350).fadeOut('slow');
      $("#typed-strings").fadeOut();
      $('body').delay(350).css({
          'overflow': 'visible'
      });
  }, 600);

})
var typed = new Typed("#typed", {
  stringsElement: '#typed-strings',
  typeSpeed: 30,
  backSpeed: 10,
  loop: false,
});
$('#typed').fadeOut();
typed.destroy();
function init0(){0
  $('#title').text(CONFIG.title)
  // $('#desc').text(CONFIG.desc)
  $('#yes').text(CONFIG.btnYes)
  $('#no').text(CONFIG.btnNo)
}

function firstQuestion(){
  $('.content').hide();
  Swal.fire({
      title: CONFIG.introTitle,
      text: CONFIG.introDesc,
      imageUrl: 'img/10.gif',
      imageWidth: 300,
      imageHeight: 300,
      background: '#fff url("img/iput-bg.jpg")',
      imageAlt: 'Custom image',
      confirmButtonText: CONFIG.btnIntro
    }).then(function(){
      $('.content').show(200);
    })
}

// switch button position
function switchButton() {
  var audio = new Audio('sound/duck.mp3');
  audio.play();
  var leftNo = $('#no').css("left");
  var topNO = $('#no').css("top");
  var leftY = $('#yes').css("left");
  var topY = $('#yes').css("top");
  $('#no').css("left", leftY);
  $('#no').css("top", topY);
  $('#yes').css("left", leftNo);
  $('#yes').css("top", topNO);
}
// move random button póition
function moveButton() {
  var audio = new Audio('sound/Swish1.mp3');
  audio.play();
  var x = Math.random() * ($(window).width() - $('#no').width()) * 0.9 ;
  var y = Math.random() * ($(window).height() - $('#no').height()) * 0.9;
  var left = x + 'px';
  var top = y + 'px';
  $('#no').css("left", left);
  $('#no').css("top", top);
}

init0()

var n = 0;
$('#no').mousemove(function() {
  if (n < 1)
      switchButton();
  if (n > 1)
      moveButton();
  n++;
});
$('#no').click(() => {
  if (screen.width>=900)
      switchButton();
})

// generate text in input
function textGenerate() {
  var n = "";
  var text = " " + CONFIG.reply;
  var a = Array.from(text);
  var textVal = $('#txtReason').val() ? $('#txtReason').val() : "";
  var count = textVal.length;
  if (count > 0) {
      for (let i = 1; i <= count; i++) {
          n = n + a[i];
          if (i == text.length + 1) {
              $('#txtReason').val("");
              n = "";
              break;
          }
      }
  }
  $('#txtReason').val(n);
  setTimeout("textGenerate()", 1);
}

// show popup
$('#yes').click(function() {
  var audio = new Audio('sound/tick.mp3');
  audio.play();
  Swal.fire({
    title: CONFIG.mess1st,
    text: CONFIG.mess1stDesc,
    imageUrl: 'img/cat-yes.jpg',
    imageWidth: 300,
    imageHeight: 300,
    background: '#fff url("img/iput-bg.jpg")',
    imageAlt: 'Custom image',
    confirmButtonText: CONFIG.reply1st
  }).then((result) => {
    if (result.value) {
        Swal.fire({
            imageUrl: 'img/bear-kiss-bear-kisses.gif',
            imageWidth: 300,
            imageHeight: 300,
            confirmButtonText: CONFIG.btnAccept,
            background: '#fff url("img/iput-bg.jpg")',
            // title: CONFIG.mess,
            text: CONFIG.messDesc,
            confirmButtonColor: '#83d0c9',
            onClose: () => {
      $("#bg").fadeOut();
      $(".content").fadeOut();
                $(".container").fadeIn("slow");
      var sf = new Snowflakes({
        color: "#c6fbff",
        minSize: 20
      });
      var url_string = window.location.href; //window.location.href
      var url = new URL(url_string);
      var c = url.searchParams.get("name");
      console.log(c);
      if (c != null) {
        document.getElementById("name").innerHTML = c;
        document.getElementById("nae").innerHTML = c;
      }
              }
        })
    }
})
  // Swal.fire({
  //     title: CONFIG.question,
  //     html: true,
  //     width: 900,
  //     padding: '3em',
  //     html: "<input type='text' class='form-control' id='txtReason' onmousemove=textGenerate()  placeholder='Cấm trả lời sai nhen :>'>",
  //     background: '#fff url("img/iput-bg.jpg")',
  //     backdrop: `
  //           rgba(0,0,123,0.4)
  //           url("img/giphy2.gif")
  //           left top
  //           no-repeat
  //         `,
  //     confirmButtonColor: '#3085d6',
  //     confirmButtonColor: '#fe8a71',
  //     confirmButtonText: CONFIG.btnReply
  // }).then((result) => {
  //     if (result.value) {
  //         Swal.fire({
  //             width: 900,
  //             confirmButtonText: CONFIG.btnAccept,
  //             background: '#fff url("img/iput-bg.jpg")',
  //             title: CONFIG.mess,
  //             text: CONFIG.messDesc,
  //             confirmButtonColor: '#83d0c9',
  //             onClose: () => {
  //       $("#bg").fadeOut();
  //       $(".content").fadeOut();
  //                 $(".container").fadeIn("slow");
  //       var sf = new Snowflakes({
  //         color: "#c6fbff",
  //         minSize: 20
  //       });
  //       var url_string = window.location.href; //window.location.href
  //       var url = new URL(url_string);
  //       var c = url.searchParams.get("name");
  //       console.log(c);
  //       if (c != null) {
  //         document.getElementById("name").innerHTML = c;
  //         document.getElementById("nae").innerHTML = c;
  //       }
  //               }
  //         })
  //     }
  // })
})

$('#play').click(function () {
  document.body.style.backgroundColor = "black";
  camera.aspect = window.innerWidth / window.innerHeight / 0.8;
  camera.updateProjectionMatrix();
  document.getElementById("heart").appendChild(renderer.domElement);
    $(".loader").fadeOut(1500);
    // $(".main").fadeIn("slow");
    // $('.balloon-border').animate({
    //     top: -500
    // }, 8000);
  var audio0 = $('.song')[0];
  audio0.play();
  setTimeout(() => {
    $('#typed').fadeIn("slow");
    typed.reset();
  }, 5000);
  // 创建气球对象，并添加到body中
  

  // 头像
  setTimeout(() => {
    // $("#heart").fadeOut();
    // document.body.style.height = "100%";
    // document.body.style.width = "100%";
    // for (var i = 0; i < 10; i++) {
    //   setTimeout(() => {
    //     var balloon = new Balloon();
    //     balloon.show();
    //     balloon.run();
    //   }, 1000);
    // }
    count = 1;
    var timer = setInterval(function () {
        var dt = Math.floor(19/picArray.length);
        if (count % dt == 0) {
          var balloon = new Balloon(picArray[Math.floor(count/dt)-1]);
        }
        else {
          var balloon = new Balloon();
        }
        balloon.show();
        balloon.run();
        count++;
        // console.log("count = " + count);
        if (count > 19) {
            clearInterval(timer);
        }
    }, 15000);
  }, 90000);
  
  // sf.destroy();
});
