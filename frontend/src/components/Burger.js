import React from 'react';

function Burger(props) {
    const contain = document.getElementById("contain");
    contain.addEventListener("click", myFunction);

    function myFunction() {
        const element = document.getElementById("nav");
        element.classList.toggle("open");
        contain.classList.toggle("change");
      }

      return (
        <div class="wrapper">
            <nav>
                <div class="burger-nav"></div>

                <div id="contain">
                    <div class="bar1"></div>
                    <div class="bar2"></div>
                    <div class="bar3"></div>
                </div>

                <ul id="nav" >
                    <li><a href="">Home</a></li>
                    <li><a href="">About</a></li>
                    <li><a href="">Photos</a></li>
                    <li><a href="">Videos</a></li>
                    <li><a href="">Contact</a></li>
                </ul>
            </nav>
        </div>
      )
}

export default Burger;