# Save Ralph!

**Web-based** two-dimensional *(*2d*)* game prepared using **`Javascript`** and **`HTML`**. <br>
[Click](http://save-ralph.eu5.org/) here for live demo!

# Getting Started

You must have seen the video of this project *"Save Ralph - A short film with Taika Waititi"* released in **2021**. If you haven't seen it, you can access the video by clicking [here](https://www.youtube.com/watch?v=G393z8s8nFY). This short film was broadcast in response to animal experiments.
In this simple game I have prepared, you must protect animals from scientists who try to experiment on animals. We know that violence is bad action. Since this should be prevented even in the game, we choose to throw apples instead of throwing weapons or bombs at scientists.


## Installing

The project **does not require** a pre-installation.
You can follow these steps to *access* the project files and *run* them on your **local computer**.

 - After clicking the green button with `Code` on the right top of the
   repo, you can click on the `Download ZIP` tab.

or 

 - You can clone the repo with this code : `gh repo clone fatihes1 /
   TodoWithFlask`

If you do one of the above **two operations**, the project source codes    will be downloaded to your local computer. After opening the directory with the source code, simply run the `index.html` file in a web browser such as **Google Chrome** or **Mozila Firefox**.

## Gameplay
Add defensive units to the playing field using the mouse (Alex). It is enough to move your mouse to the coins that appear in random areas in the game area. You don't need to click. Help Alex save the animals from experiments!

##  Built With

 - [HTML5](https://www.w3schools.com/html/), *Hypertext Markup Language*
 - [CSS3](https://www.w3schools.com/css/), *Cascading Style Sheets*
 - [JavaScript](https://www.javascript.com/),  *A Dynamic Programming Language*

You can access the **tutorial pages** by clicking the **titles**.
## In-game Images


> While the game is on
![game](https://user-images.githubusercontent.com/54971670/117555500-673bed00-b068-11eb-91d9-91f09268ae62.png)
>When the game is lost
![gameover](https://user-images.githubusercontent.com/54971670/117555501-6a36dd80-b068-11eb-87a0-81eea3163945.png)
>When the game is won
![win](https://user-images.githubusercontent.com/54971670/117555502-6c00a100-b068-11eb-85a8-d58fbddb0db8.png)
## For Developers

The project consists of two folders **(pictures, sounds)** and 3 files. The images used in the game content are included in the `images` folder. The `sounds` folder contains the sound effects in the game.
For those who want to work on or develop the project, the **information** about why **certain functions** and **classes** in the source code are used and their **content** are listed below :
#### `script.js` 
> • `class Cell` : This class is used to describe the playing field cells' locations as coordinates. <br>
> • `function createGrid()` : It divides the playing field according to the parameters defined in the Cell class and divides it into 5 * 9 = 45 identical areas for this project (excluding the control bar) and creates a cell object for each area. <br>
> • `class  Projectiles` : This class has several variables and parameters such as bullet (for this project apple)  size and position for this project. You can make the defending team player throw an apple with the `new Projectiles()` command when necessary in the project (Like the defending team player seeing the attacking team player).<br>
> • `function  handleProjectiles()` : With this function, functions such as advancing the apple and dealing damage and disappearing from view when it hits the enemy unit are defined.<br>
> • `class  Defender` : This class is the definition of the defending team. It has variables and functions such as the health of the defending team, the area it will occupy on the playing field, animation timing, creation of the apple (bullet).<br>
> • `function  handleDefenders()` : Updating the necessary variable if the enemy and the defending unit are on the same horizontal alignment, the functions that should occur when the enemy unit collides with the defensive unit are defined.<br>
> • `function  chooseDefender()` : Although it is currently out of use, it is a function written to determine which defensive units are selected when new and different defensive units are added to the project.<br>
> • `class  FloatingMessage` : It is the class in which lost messages are defined to display updates in various areas within the game.<br>
> • `function  handleFloatingMessages()` : It is responsible for the disappearance time and deletion from the screen of objects that consist of the `floatingMessages` class.<br>
> • `class  Enemy` : This class is the definition of the attacking team. It has variables and functions such as the health of the defending team, the area to be covered on the playing field, animation timing, and the type of enemy to be created.<br>
> • `function  handleEnemies()` : Functions such as generating attacking units and disappearing when their health is equal to zero are defined.<br>
> • `class  Resource` : It contains features such as the location and value of the gold that falls on the field of the game at certain times.<br>
> • `function  handleResources()` : When it comes to gold falling on the ground, it allows it to be added to the resource.<br>
> • `function  handleGameStatus()` : It has functions and features such as defining and displaying the text that will appear on the screen depending on whether the game is successfully completed or not.<br>
> • `function  animation()` : It is the main function of the game. It allows calling defined functions and repeating them recursively, unless the game ends.<br>
> • `function  collision(first,  second)` : It is used to check the coincidence of the coordinates of two defined units.<br>
## Author
`Fatih Es`
*You can fallow me on [LinkedIn](https://www.linkedin.com/in/fatihes/) and you can check my resume [website](https://fatihes1.github.io/) !*



