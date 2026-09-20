/* =========================================================
   RAFA BOAT — SCRIPT.JS
   Site premium | Lagoa Guaraíras — Tibau do Sul/RN
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       CONFIGURAÇÕES
       ===================================================== */

    const CONFIG = {
        whatsapp: "558499048190",

        // Valor padrão por pessoa
        pricePerPerson: 75,

        // Taxa de preservação por pessoa
        preservationFee: 10,

        currency: "BRL"
    };


    /* =====================================================
       ELEMENTOS PRINCIPAIS
       ===================================================== */

    const body = document.body;

    const openingScreen = document.querySelector(".opening-screen");
    const openingButton = document.querySelector(".opening-button");
    const openingVideo = document.querySelector(".opening-video");

    const navbar = document.querySelector(".navbar");
    const menuToggle = document.querySelector(".menu-toggle");
    const navMenu = document.querySelector(".nav-menu");

    const bookingForm = document.querySelector("#bookingForm");

    const peopleInput =
        document.querySelector("#people") ||
        document.querySelector("#quantity") ||
        document.querySelector('input[name="people"]');

    const tourSelect =
        document.querySelector("#tour") ||
        document.querySelector('select[name="tour"]');

    const priceElement =
        document.querySelector("#tourPrice") ||
        document.querySelector("[data-tour-price]");

    const totalElement =
        document.querySelector("#totalPrice") ||
        document.querySelector("[data-total-price]");

    const preservationElement =
        document.querySelector("#preservationPrice") ||
        document.querySelector("[data-preservation-price]");


    /* =====================================================
       FUNÇÕES AUXILIARES
       ===================================================== */

    function formatCurrency(value) {
        return new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: CONFIG.currency
        }).format(value);
    }


    function getPeople() {
        if (!peopleInput) return 1;

        let value = parseInt(peopleInput.value);

        if (isNaN(value) || value < 1) {
            value = 1;
        }

        return value;
    }


    function getCurrentPrice() {

        // Primeiro tenta pegar o preço do select
        if (tourSelect && tourSelect.selectedOptions.length) {

            const selected = tourSelect.selectedOptions[0];

            const dataPrice =
                selected.dataset.price ||
                selected.getAttribute("data-price");

            if (dataPrice) {
                const parsed = parseFloat(
                    dataPrice.replace(",", ".")
                );

                if (!isNaN(parsed)) {
                    return parsed;
                }
            }
        }

        // Depois tenta pegar de elemento específico
        if (priceElement) {

            const dataPrice =
                priceElement.dataset.price ||
                priceElement.getAttribute("data-price");

            if (dataPrice) {
                const parsed = parseFloat(
                    dataPrice.replace(",", ".")
                );

                if (!isNaN(parsed)) {
                    return parsed;
                }
            }
        }

        return CONFIG.pricePerPerson;
    }


    /* =====================================================
       ABERTURA CINEMATOGRÁFICA
       ===================================================== */

    function hideOpening() {

        if (!openingScreen) return;

        openingScreen.classList.add("hide");

        body.classList.remove("no-scroll");

        // Aguarda a animação antes de remover
        setTimeout(() => {
            openingScreen.style.display = "none";
        }, 1000);
    }


    if (openingScreen) {

        body.classList.add("no-scroll");

        // Garante que o vídeo comece
        if (openingVideo) {

            openingVideo.muted = true;
            openingVideo.playsInline = true;

            const playVideo = () => {
                openingVideo.play().catch(() => {
                    console.log("Autoplay bloqueado pelo navegador.");
                });
            };

            playVideo();

            openingVideo.addEventListener("loadeddata", playVideo);
        }
    }


    if (openingButton) {

        openingButton.addEventListener("click", () => {
            hideOpening();
        });
    }


    // Se o vídeo terminar, libera o site
    if (openingVideo) {

        openingVideo.addEventListener("ended", () => {

            // Mantém a abertura por um pequeno instante
            setTimeout(() => {
                hideOpening();
            }, 800);

        });
    }


    /* =====================================================
       NAVBAR
       ===================================================== */

    function updateNavbar() {

        if (!navbar) return;

        if (window.scrollY > 40) {
            navbar.classList.add("scrolled");
        } else {
            navbar.classList.remove("scrolled");
        }
    }

    updateNavbar();

    window.addEventListener("scroll", updateNavbar, {
        passive: true
    });


    /* =====================================================
       MENU MOBILE
       ===================================================== */

    if (menuToggle && navMenu) {

        menuToggle.addEventListener("click", () => {

            menuToggle.classList.toggle("active");
            navMenu.classList.toggle("active");

        });


        const menuLinks = navMenu.querySelectorAll("a");

        menuLinks.forEach(link => {

            link.addEventListener("click", () => {

                menuToggle.classList.remove("active");
                navMenu.classList.remove("active");

            });

        });
    }


    /* =====================================================
       NAVEGAÇÃO SUAVE
       ===================================================== */

    document.querySelectorAll('a[href^="#"]').forEach(link => {

        link.addEventListener("click", function (event) {

            const targetId = this.getAttribute("href");

            if (
                !targetId ||
                targetId === "#" ||
                targetId.length < 2
            ) {
                return;
            }

            const target = document.querySelector(targetId);

            if (!target) return;

            event.preventDefault();

            const navbarHeight = navbar
                ? navbar.offsetHeight
                : 0;

            const position =
                target.getBoundingClientRect().top +
                window.scrollY -
                navbarHeight;

            window.scrollTo({
                top: position,
                behavior: "smooth"
            });

        });

    });


    /* =====================================================
       ANIMAÇÕES REVEAL
       ===================================================== */

    const revealElements = document.querySelectorAll(
        ".reveal, .reveal-left, .reveal-right"
    );

    if (revealElements.length) {

        const revealObserver = new IntersectionObserver(
            (entries, observer) => {

                entries.forEach(entry => {

                    if (!entry.isIntersecting) return;

                    entry.target.classList.add("visible");

                    observer.unobserve(entry.target);

                });

            },
            {
                threshold: 0.12
            }
        );


        revealElements.forEach(element => {
            revealObserver.observe(element);
        });

    }


    /* =====================================================
       CONTROLE DE QUANTIDADE
       ===================================================== */

    const quantityButtons =
        document.querySelectorAll(
            ".quantity-btn, [data-action]"
        );


    quantityButtons.forEach(button => {

        button.addEventListener("click", () => {

            const action =
                button.dataset.action ||
                button.getAttribute("data-action");

            if (!peopleInput) return;

            let value = getPeople();

            if (
                action === "plus" ||
                action === "increase"
            ) {
                value++;
            }

            if (
                action === "minus" ||
                action === "decrease"
            ) {
                value--;

                if (value < 1) {
                    value = 1;
                }
            }

            peopleInput.value = value;

            updatePrice();

        });

    });


    if (peopleInput) {

        peopleInput.addEventListener("input", () => {

            let value = parseInt(peopleInput.value);

            if (isNaN(value) || value < 1) {
                value = 1;
            }

            peopleInput.value = value;

            updatePrice();

        });

    }


    /* =====================================================
       CÁLCULO DA RESERVA
       ===================================================== */

    function updatePrice() {

        const people = getPeople();
        const price = getCurrentPrice();

        const subtotal = price * people;

        const preservation =
            CONFIG.preservationFee * people;

        const total = subtotal + preservation;


        if (priceElement) {
            priceElement.textContent =
                formatCurrency(price);
        }


        if (preservationElement) {
            preservationElement.textContent =
                formatCurrency(preservation);
        }


        if (totalElement) {
            totalElement.textContent =
                formatCurrency(total);
        }


        // Elementos extras caso existam
        const subtotalElement =
            document.querySelector("#subtotalPrice");

        if (subtotalElement) {
            subtotalElement.textContent =
                formatCurrency(subtotal);
        }

    }


    updatePrice();


    if (tourSelect) {

        tourSelect.addEventListener("change", () => {
            updatePrice();
        });

    }


    /* =====================================================
       CARDS DE PASSEIOS
       ===================================================== */

    const tourCards =
        document.querySelectorAll(
            ".tour-card, [data-tour]"
        );


    tourCards.forEach(card => {

        card.addEventListener("click", event => {

            // Não interfere em links/botões internos
            if (
                event.target.closest("a") ||
                event.target.closest("button")
            ) {
                return;
            }

            const tourName =
                card.dataset.tour ||
                card.querySelector(".tour-title")?.textContent ||
                card.querySelector("h3")?.textContent;

            const cardPrice =
                card.dataset.price;

            if (tourSelect && tourName) {

                const options =
                    Array.from(tourSelect.options);

                const matchingOption =
                    options.find(option =>
                        option.textContent
                            .trim()
                            .toLowerCase()
                            .includes(
                                tourName.trim().toLowerCase()
                            )
                    );

                if (matchingOption) {

                    tourSelect.value =
                        matchingOption.value;

                }
            }


            if (cardPrice && priceElement) {

                const parsed =
                    parseFloat(
                        cardPrice.replace(",", ".")
                    );

                if (!isNaN(parsed)) {

                    priceElement.dataset.price =
                        parsed;

                }
            }


            updatePrice();


            const bookingSection =
                document.querySelector("#reservas") ||
                document.querySelector("#booking");

            if (bookingSection) {

                bookingSection.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            }

        });

    });


    /* =====================================================
       RESERVA → WHATSAPP
       ===================================================== */

    if (bookingForm) {

        bookingForm.addEventListener("submit", event => {

            event.preventDefault();


            const formData =
                new FormData(bookingForm);


            const name =
                formData.get("name") ||
                formData.get("nome") ||
                "";


            const phone =
                formData.get("phone") ||
                formData.get("telefone") ||
                "";


            const date =
                formData.get("date") ||
                formData.get("data") ||
                "";


            const time =
                formData.get("time") ||
                formData.get("horario") ||
                "";


            const people =
                formData.get("people") ||
                formData.get("pessoas") ||
                getPeople();


            const tour =
                formData.get("tour") ||
                formData.get("passeio") ||
                tourSelect?.selectedOptions[0]?.textContent ||
                "Passeio de lancha";


            const message =
                formData.get("message") ||
                formData.get("mensagem") ||
                "";


            const price =
                getCurrentPrice();


            const preservation =
                CONFIG.preservationFee * people;


            const total =
                price * people + preservation;


            /* ---------------------------------------------
               VALIDAÇÕES
            --------------------------------------------- */

            if (!name.trim()) {

                alert("Digite seu nome para continuar.");

                return;

            }


            if (!date) {

                alert("Selecione a data do passeio.");

                return;

            }


            if (!time) {

                alert("Selecione o horário do passeio.");

                return;

            }


            /* ---------------------------------------------
               FORMATA DATA
            --------------------------------------------- */

            let formattedDate = date;

            if (date.includes("-")) {

                const parts =
                    date.split("-");

                if (parts.length === 3) {

                    formattedDate =
                        `${parts[2]}/${parts[1]}/${parts[0]}`;

                }

            }


            /* ---------------------------------------------
               MENSAGEM WHATSAPP
            --------------------------------------------- */

            const whatsappMessage = `

🚤 *NOVA RESERVA — RAFA BOAT*

Olá! Gostaria de fazer uma reserva para um passeio na Lagoa Guaraíras.

━━━━━━━━━━━━━━━━━━

👤 *Nome:* ${name}

📱 *Telefone:* ${phone || "Não informado"}

🚤 *Passeio:* ${tour}

📅 *Data:* ${formattedDate}

⏰ *Horário:* ${time}

👥 *Pessoas:* ${people}

━━━━━━━━━━━━━━━━━━

💰 *Valor por pessoa:* ${formatCurrency(price)}

🌊 *Taxa de preservação:* ${formatCurrency(preservation)}

💵 *Total estimado:* ${formatCurrency(total)}

━━━━━━━━━━━━━━━━━━

📝 *Observações:*
${message || "Nenhuma observação."}

Gostaria de confirmar a disponibilidade e finalizar minha reserva.

_Enviado pelo site oficial Rafa Boat._
`.trim();


            const whatsappURL =
                `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(
                    whatsappMessage
                )}`;


            window.open(
                whatsappURL,
                "_blank",
                "noopener,noreferrer"
            );

        });

    }


    /* =====================================================
       FAQ
       ===================================================== */

    const faqItems =
        document.querySelectorAll(".faq-item");


    faqItems.forEach(item => {

        const question =
            item.querySelector(".faq-question");

        const answer =
            item.querySelector(".faq-answer");


        if (!question || !answer) return;


        question.addEventListener("click", () => {

            const isActive =
                item.classList.contains("active");


            // Fecha todos
            faqItems.forEach(otherItem => {

                otherItem.classList.remove("active");

                const otherAnswer =
                    otherItem.querySelector(".faq-answer");

                if (otherAnswer) {
                    otherAnswer.style.maxHeight = null;
                }

            });


            // Abre o selecionado
            if (!isActive) {

                item.classList.add("active");

                answer.style.maxHeight =
                    answer.scrollHeight + "px";

            }

        });

    });


    /* =====================================================
       GALERIA / LIGHTBOX
       ===================================================== */

    const galleryItems =
        document.querySelectorAll(
            ".gallery-item, [data-gallery]"
        );


    const lightbox =
        document.querySelector(".lightbox");


    const lightboxImage =
        document.querySelector(
            ".lightbox img, #lightboxImage"
        );


    const lightboxClose =
        document.querySelector(
            ".lightbox-close, [data-lightbox-close]"
        );


    function closeLightbox() {

        if (!lightbox) return;

        lightbox.classList.remove("active");

        body.classList.remove("no-scroll");

    }


    galleryItems.forEach(item => {

        item.addEventListener("click", () => {

            if (!lightbox || !lightboxImage) return;


            const image =
                item.querySelector("img");


            if (!image) return;


            lightboxImage.src =
                image.currentSrc ||
                image.src;


            lightboxImage.alt =
                image.alt ||
                "Rafa Boat";


            lightbox.classList.add("active");

            body.classList.add("no-scroll");

        });

    });


    if (lightboxClose) {

        lightboxClose.addEventListener(
            "click",
            closeLightbox
        );

    }


    if (lightbox) {

        lightbox.addEventListener(
            "click",
            event => {

                if (
                    event.target === lightbox
                ) {
                    closeLightbox();
                }

            }
        );

    }


    document.addEventListener(
        "keydown",
        event => {

            if (event.key === "Escape") {
                closeLightbox();
            }

        }
    );


    /* =====================================================
       VÍDEOS
       ===================================================== */

    const videos =
        document.querySelectorAll("video");


    videos.forEach(video => {

        video.setAttribute(
            "playsinline",
            ""
        );


        // Vídeos decorativos
        if (
            video.classList.contains(
                "hero-video"
            ) ||
            video.classList.contains(
                "opening-video"
            )
        ) {

            video.muted = true;

        }

    });


    /* =====================================================
       DATA ATUAL NO FOOTER
       ===================================================== */

    const currentYear =
        document.querySelector("#currentYear");


    if (currentYear) {

        currentYear.textContent =
            new Date().getFullYear();

    }


    /* =====================================================
       BOTÕES WHATSAPP
       ===================================================== */

    document.querySelectorAll(
        "[data-whatsapp]"
    ).forEach(button => {

        button.addEventListener("click", () => {

            const customMessage =
                button.dataset.whatsapp ||
                "Olá! Gostaria de saber mais sobre os passeios da Rafa Boat.";


            const url =
                `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(
                    customMessage
                )}`;


            window.open(
                url,
                "_blank",
                "noopener,noreferrer"
            );

        });

    });


    /* =====================================================
       PARALLAX LEVE NO HERO
       ===================================================== */

    const heroImage =
        document.querySelector(".hero-image");


    if (heroImage) {

        window.addEventListener(
            "scroll",
            () => {

                const scroll =
                    window.scrollY;

                if (scroll < 700) {

                    heroImage.style.transform =
                        `scale(1.04) translateY(${scroll * 0.08}px)`;

                }

            },
            {
                passive: true
            }
        );

    }


    /* =====================================================
       PROTEÇÃO CONTRA SUBMISSÃO DUPLA
       ===================================================== */

    if (bookingForm) {

        bookingForm.addEventListener(
            "submit",
            () => {

                const submitButton =
                    bookingForm.querySelector(
                        'button[type="submit"]'
                    );


                if (submitButton) {

                    const originalText =
                        submitButton.innerHTML;


                    submitButton.innerHTML =
                        "ABRINDO WHATSAPP...";


                    setTimeout(() => {

                        submitButton.innerHTML =
                            originalText;

                    }, 2500);

                }

            }
        );

    }


    /* =====================================================
       CONSOLE
       ===================================================== */

    console.log(
        "%c RAFA BOAT ",
        "font-size:20px;font-weight:bold;"
    );

    console.log(
        "Site carregado com sucesso."
    );

});