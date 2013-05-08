(function ($, window, document, undefined) {
    $.PolaroidPhotoStack = {
        isUnLocked: function () {
            var lock = $.data(document.body, "PPS-lock");
            return ( typeof lock === "undefined" || lock == null || lock === false );
        },
        lock: function () {
            $.data(document.body, "PPS-lock", true);
        },
        unLock: function () {
            $.data(document.body, "PPS-lock", false);
        },
        addControls: function (cssPrefix) {
            // todo @PAS August 21 2012 : Hard coding the height will eventually fail.
            var $photoStackContainer = $("<div />", { id: cssPrefix + "-Container" }).css({
                    "width": 500 + "px",
                    "height": 500 + "px"
                }).appendTo(document.body).center(false),
                $buttonNext = $("<div/>", { id: cssPrefix + "-Next" }).hide(),
                $buttonPrev = $("<div/>", { id: cssPrefix + "-Prev" }).hide(),
                $buttonClose = $("<div/>", { id: cssPrefix + "-Close" }).hide();
            $buttonNext.bind("click", function () {
                $photoStackContainer.children("div:nth-child(4)")
                    .animate(
                    {
                        "top": "0%",
                        "left": "0%"
                    },
                    {
                        duration: "slow",
                        complete: function () {
                            $(this).remove();
                            $photoStackContainer.append($(this));
                            $(this).animate(
                                {
                                    "top": "50%",
                                    "left": "50%"
                                },
                                "slow"
                            );
                        }
                    }
                );
            });
            $buttonPrev.bind("click", function () {
                $photoStackContainer.children("div:last-child")
                    .animate(
                    {
                        "top": "0%",
                        "left": "0%"
                    },
                    {
                        duration: "slow",
                        complete: function () {
                            $(this).remove();
                            $photoStackContainer.children("div:nth-child(3)").after($(this));
                            $(this).animate(
                                {
                                    "top": "50%",
                                    "left": "50%"
                                },
                                "slow"
                            );
                        }
                    }
                );
            });
            $buttonClose.bind("click", function () {
                $photoStackContainer.fadeOut(
                    "slow",
                    function () {
                        $("." + cssPrefix + "-Photo-Wrapper").remove();
                        $("#" + cssPrefix + "-Next").remove();
                        $("#" + cssPrefix + "-Prev").remove();
                        $("#" + cssPrefix + "-Close").remove();
                        $("#" + cssPrefix + "-Container").remove();
                    }
                );
                $.PolaroidPhotoStack.unLock();
            });
            $photoStackContainer.append($buttonNext).append($buttonPrev).append($buttonClose);
        },
        showControls: function (cssPrefix) {
            $("#" + cssPrefix + "-Next").fadeIn("slow");
            $("#" + cssPrefix + "-Prev").fadeIn("slow");
            $("#" + cssPrefix + "-Close").fadeIn("slow");
            $("." + cssPrefix + "-Photo").fadeIn("slow");
            $("." + cssPrefix + "-Photo-Wrapper").fadeIn("slow");
        },
        loadData: function (data, textStatus, jqXHR, cssPrefix) {
            // Count Down Latch is designed to fire off a function after it fires n number of times.
            var CountDownLatch = function (count) {
                this.count = count;
            };
            CountDownLatch.prototype.fire = function () {
                this.count--;
                if (this.count <= 0) {
                    $.PolaroidPhotoStack.showControls(cssPrefix);
                }
            };
            var countDownLatch = new CountDownLatch(data.length),
                xtndFn = function (indexInArray, valueOfElement, countDownLatch) {
                    var $photo = $("<img class='" + cssPrefix + "-Photo'/>")
                        .hide()
                        .attr("src", "/" + valueOfElement)
                        .load(function () {
                            var from = -3,
                                to = 3,
                                r = Math.floor(Math.random() * (to - from + 1) + from),
                                imgwidth = $(this).width(),
                                imgheight = $(this).height(),
                                rotate = {
                                    "-moz-transform": "rotate(" + r + "deg)",
                                    "-webkit-transform": "rotate(" + r + "deg)",
                                    "transform": "rotate(" + r + "deg)",
                                    "width": imgwidth + "px",
                                    "height": imgheight + "px",
                                    "margin-top": "-" + (imgheight / 2) + "px",
                                    "margin-left": "-" + (imgwidth / 2) + "px"
                                };
                            $(this).wrap($("<div class='" + cssPrefix + "-Photo-Wrapper'/>").css(rotate).hide());
                            countDownLatch.fire();
                });
                $("#" + cssPrefix + "-Container").append($photo);
            };
            $.each(data, function (indexInArray, valueOfElement) {
                xtndFn(indexInArray, valueOfElement, countDownLatch);
            });
        },
        dynamicLoad: function (dataUrl, albumName, cssPrefix) {
            $.getJSON(dataUrl, { albumName: albumName }, function (data, textStatus, jqXHR) {
                $.PolaroidPhotoStack.loadData(data, textStatus, jqXHR, cssPrefix);
            });
        },
        destroy: function() {
            $("#" + this.params.cssPrefix + "-Next").remove();
            $("#" + this.params.cssPrefix + "-Prev").remove();
            $("#" + this.params.cssPrefix + "-Close").remove();
            $("." + this.params.cssPrefix + "-Photo").remove();
            $("." + this.params.cssPrefix + "-Photo-Wrapper").remove();
        }
    };
    $.fn.center = function (parent) {
        if (parent) {
            parent = this.parent();
        } else {
            parent = window;
        }
        this.css({
            "position": "absolute",
            "top": ((($(parent).height() - this.outerHeight()) / 2) + $(parent).scrollTop() + "px"),
            "left": ((($(parent).width() - this.outerWidth()) / 2) + $(parent).scrollLeft() + "px")
        });
        return this;
    };
    $.fn.PolaroidPhotoStack = function (options) {
        var params = $.extend({
                "data": null,
                "dataUrl": "/Polaroid-Photo-Stack.php",
                "albumName": "album",
                "cssPrefix": "PPS"
            }, options),
        mainFunction = function () {
            if ($.PolaroidPhotoStack.isUnLocked()) {
                $.PolaroidPhotoStack.lock();
                $.PolaroidPhotoStack.addControls(params.cssPrefix);
                if (params.data === null) {
                    $.PolaroidPhotoStack.dynamicLoad(params.dataUrl, $(this).attr(params.albumName), params.cssPrefix);
                } else {
                    $.PolaroidPhotoStack.loadData(params.data, null, null, params.cssPrefix);
                }
            }
        };
        this.params = params;
        if ( $.fn.jquery.split(".")[1] >= 7 ) {
            this.on("click", mainFunction );
        } else {
            this.bind("click", mainFunction );
        }
        return this;
    };
})(jQuery, window, document);