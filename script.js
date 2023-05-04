/*
2 adet değer alır.
ilk değer butonun class'ı yani başarılı-başarısız durumunu ayırt etmek için kullanılır.
ikincisi ise görevi bulmak için kullanılır.
*/
function gorevi_guncelle(button_class, gorev_ismi){
    $(JSON.parse(localStorage.getItem("yapilacaklar"))).each(function(i, e){
        //e.ogeler derken görevler objelerinin bulunduğu array kastediliyor.
        for (const obj of e.ogeler) {
            if(button_class == "btn-danger")
                {
                    if(gorev_ismi == obj["isim"])
                    {
                        //Şartlar kontrol edildikten sonra localstorage güncelleniyor.
                        obj["durum"] = false
                        localStorage.setItem("yapilacaklar", JSON.stringify(this))
                    }
                }
                if(button_class == "btn-success")
                {
                    if(gorev_ismi == obj["isim"])
                    {
                        //Şartlar kontrol edildikten sonra localstorage güncelleniyor.
                        obj["durum"] = true
                        localStorage.setItem("yapilacaklar", JSON.stringify(this))
                    }    
                }
            }
        })
    }
function gorevleri_yukle(){
    //İlk Olarak Listeler Temizlenir
    $(".col-4")[3].innerHTML = ""
    $(".col-4")[4].innerHTML = ""
    $(".col-4")[5].innerHTML = ""

    $(JSON.parse(localStorage.getItem("yapilacaklar"))).each(function(i, e){
        /*
        içerisinde bulunan e.ogeler arrayi kadar bir döngü döndürür.
        e.ogeler'den kastımız burda görev objelerinin bulunduğu arraydir.
        */
        for(const obj of e.ogeler)
        {
            //switch-case ile durumu kontrol eder ve doğru listeye yerleştirir.
            switch(obj.durum)
            {
                case true:
                    $(".col-4")[3].innerHTML += `<div class='bg-success m-3 d-flex justify-content-around align-items-center p-1'><span>${obj.isim}</span></div>`
                    break
                case "sirada":
                    $(".col-4")[4].innerHTML += `<div style='height: 32px;' class='bg-secondary m-3 d-flex justify-content-around align-items-center p-1'><span>${obj.isim}</span><button style="width: 20px;display: flex; height: 30px;justify-content: center;align-items: center;" class='btn btn-success'><span class="material-symbols-outlined">done</span></button><button class='btn btn-danger'  style='width: 20px;display: flex; height: 30px;justify-content: center;align-items: center;'><span class="material-symbols-outlined">close</span></button></div>`
                    break
                case false:
                    $(".col-4")[5].innerHTML += `<div class='bg-danger m-3 d-flex justify-content-around align-items-center p-1'><span>${obj.isim}</span></div>`
                    break
                default:
                    console.log("returned")
                    break
            }
        }
    })
    /*
    Görev tamamlandı veya vazgeçildi durumunu ayarlamak için kullanılır.
    Algoritmik olarak bu konumda olmaları gerekiyor.
    aksi takdirde görevlerin liste değiştirmesi için sayfanın yenilenmesi gerekiyor.
    gorevleri_guncelle fonksiyonu çağırılır.
    */
    $(".btn-success").on("click", function(){
        gorevi_guncelle(this.classList[1], this.parentElement.children[0].innerText)
        gorevleri_yukle()
    })
    $(".btn-danger").on("click", function(){
        gorevi_guncelle(this.classList[1], this.parentElement.children[0].innerText)
        gorevleri_yukle()
    })
}   
$(function(){
    /*
    Görevlerin tanımlanacağı localstorage'ı kontrol eder.
    Eğer yoksa bir adet oluşturur.
    Eğer varsa görevleri yükler.
    */
    if(!localStorage.getItem("yapilacaklar"))
        localStorage.setItem("yapilacaklar", JSON.stringify({ogeler: []}))
    else
        gorevleri_yukle()

    //Form Submit olayında sayfanın yenilenmesini engeller
    var form = document.getElementById("myForm");
    function submitForm(event){
        event.preventDefault();
    }
    form.onsubmit = submitForm

    //Listeye yeni bir görev eklenen kısım
    $("#add").on("click", function(){
        if($("input").val().trim())
        {
            var yeni_gorev = {
                isim: $("input").val(),
                durum: "sirada"
            }
            $(JSON.parse(localStorage.getItem("yapilacaklar"))).each(function(i, e){
                e.ogeler.push(yeni_gorev)
                localStorage.setItem("yapilacaklar", JSON.stringify(e))
                console.log(e)
            })
            $("input").val("")
            /*
            Görevleri yeniden yükler
            'gorevleri_yukle' fonksiyonu çağılırı
            */
            gorevleri_yukle()
        }
    })
    $("#delete-all").on("click", function(){
        Swal.fire({
            title: 'Tüm Görevleriniz Sıfırlanacaktır.',
            text: "Sıfırlama işlemi geri alınamaz!\n Emin misiniz?",
            icon: 'warning',
            background: '#2d3436',
            color: '#fff',
            iconColor: '#fff',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Evet, sil!',
            cancelButtonText: 'Hayır, vazgeç'
        }).then((result) => {
            if (result.isConfirmed) 
            {
                Swal.fire({
                    title: "Tüm Görevler Temizlendi",
                    confirmButtonColor: '#d33',
                    confirmButtonText: 'Tüm Görevler Temizlendi.',
                    background: "#2d3436"
                })
                localStorage.setItem("yapilacaklar", JSON.stringify({ogeler: []}))
                gorevleri_yukle()
            } else if (result.dismiss === Swal.DismissReason.cancel) 
            {
                Swal.fire({
                    title: "İşlem İptal Edildi.",
                    confirmButtonText: 'Anladım.',
                    confirmButtonColor: '#3085d6',
                    background: "#2d3436"
                })
            }
        })
    })
})