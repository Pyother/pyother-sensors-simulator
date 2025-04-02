# Metody naukowe

### Źródła naukowe

* Thrun, S., Burgard, W., & Fox, D. (2005). Probabilistic Robotics.
* Welch, G., & Bishop, G. (1995). An Introduction to the Kalman Filter
opisują te metody w kontekście filtrów Kalmana.
* [Multi Sensor Fusion for Navigation and Mapping in
Autonomous Vehicles: Accurate Localization in
Urban Environments](https://arxiv.org/pdf/2103.13719), Li Qingqing1, Jorge Pena Queralta, Tuan Nguyen Gia, Zhuo Zou, Tomi Westerlund

### Założenia pracy

* Opisanie lokalizacji i otoczenia pojazdu za pomocą równania, którego argumentami są odczyty czujników pomiarowych różnego typu. 
* **Stowrzenie równania modelu pomiarowego** - każdy czujnik posiada równanie pomiarowe, które zwraca odczytaną wartość z uwzględnieniem tego, jak charakterystyka czujnika (typ czujnika, typ pomiaru, środowisko testowe) wpływa na szum. 
  
    Równanie pomiaru:
    ```math
    z_t = h(x_t) + v_t
    ```
    gdzie:
    * *h* - funkcja pomiarowa.
    * *v* - szum pomiarowy.
  
* **Stworzenie równania globalnego** - jest to równanie opisujące ruch i położenie urządzenia. W każdym kolejnym kroku jest ono aktualizowane na podstawie równań pomiarowch reprezentujących danych czujnik. Jedną z koncepcji pozwalających na kontrolowanie odczytów jest nadanie równaniom pomiarowym wag, za pomocą których można kontrolować istotoność poszczególnego czujnika. 

    ```math
    x^t​=argmin​=1∑N​(zt(i)​−hi​(xt​))T(Rt(i)​) −1(zt(i)​−hi​(xt​))
    ```
