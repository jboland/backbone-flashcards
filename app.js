var Flashcard = {};

  var data =   {
    "simplified":"安",
    "traditional":"安",
    "pinyin":"ān",
    "pinyin_num":"an1",
    "definition":"content; calm; still; quiet; safe; secure; in good health; to find a place for; to install; to fix; to fit; to bring (a charge against sb); to pacify; security; safety; peace; ampere",
    "Words 词语":"安全"
  };


$(document).ready(function() {


  var Word = function (params) {
    var self = this;

    self.init = function(params) {
      self.simplified = params['simplified'];
      self.traditional = params['traditional'];
      self.pinyin = params['pinyin'];
      self.pinyin_accent_raw = params['pinyin_num'];
      self.definition = params['definition'];

      var accent = self.pinyin_accent_raw.match(/[0-9]/);

      if (accent && accent.length > 0) {
        self.pinyin += accent[0];
      }
    }

   self.init(params);

  }

  var word_list = $.ajax({
    url: "/hanban.json",
    type: "GET",
    success: function(data) {
      initFlashcards(data);
    }
  });

  var wordindex = 0;

  var initFlashcards = function (data) {
    if (data.length === 0) {
      console.error("No words found...");
      return;
    }


    var first_word = new Word(data[0]);
    constructFlashcard(first_word);

    bindNavigation(data);
  }


  var constructFlashcard = function(word) {
    var $simplified = $(".flash-card-container .simplified"),
        $pinyin = $(".flash-card-container .pinyin-accented"),
        $definition = $(".flash-card-container .definition");

      // fill in params

      $simplified.text(word.simplified);
      $pinyin.text(word.pinyin);
      $definition.text(word.definition);

      // always init a card on chinese character
      $(".flash-card-container").removeClass("flipped");
  }

  var bindNavigation = function(data) {
    $(".nav .prev").on("click", function() {
      if(wordindex > 0) {
        wordindex -= 1;
        var current_word = data[wordindex];
        if (!(current_word instanceof Word)) {
          current_word = new Word(current_word);
        }
        constructFlashcard(current_word);
        cleanupNav(data.length);
      }
    });

    $(".nav .next").on("click", function() {
      if(wordindex < data.length - 1) {
        wordindex += 1;
        var current_word = data[wordindex];
        if (!(current_word instanceof Word)) {
          current_word = new Word(current_word);
        }
        constructFlashcard(current_word);
        cleanupNav(data.length);
      }
    });

  }


  var cleanupNav = function(datalength) {
    if (wordindex === 0) {
      $(".prev").addClass("hidden");
    } else if (wordindex === datalength - 1) {
      $(".next").addClass("hidden");
    } else {
      $(".prev, .next").removeClass("hidden");
    }
    $(".card-counter").html(["",wordindex + 1,"/",datalength].join(""));
  }
// test example from local data
  //var test_word = new Word(data);
  //constructFlashcard(test_word);



  $(".flash-card-container .header").on("click", function() {
    $(".flash-card-container").toggleClass("flipped");
  });

});