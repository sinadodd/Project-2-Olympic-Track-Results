#### Rosina Dodd <br> Project 2 <hr>
# Running Through Time

### Summary
Explore the speeds of Olympic track medalists over the years and build a simulation race between any of them, across time, gender, and event.

### Dataset
https://www.kaggle.com/jayrav13/olympic-track-field-results
	
### GitHub
https://github.com/sinadodd/Project-2-Olympic-Track-Results

### GitHub Page
https://sinadodd.github.io/Project-2-Olympic-Track-Results/

<hr>

# Process Discussion
After setting up a basic html (hijacked from our past homework assignments), I got the selectors working. The list of years that is available in the Year Selector dropdown changes depending on the event, so when the event is changed, the Year Selector defaults back to "all".

During the days of work solely focused on data manipulation, I kept finding new issues with the data that had to be cleaned up.

> <strong>Results had inconsistent formats, including:</strong><br>
>“2h15:08.40”<br>
>“2:15:08.4”<br>
>“2-15:08”<br>
>“2-15:08.40”<br>
>“15:08.40”<br>
>"8.4,+0.1" (wind factor at 200M in Beijing, 2008)<br>
>8.40<br>

Added a key for distance, derived from the event name, and was able to use time (now converted to seconds) to get a speed field for each result.

After 4 days of data wrangling, I got the data selectors functional and I was finally able to make a super basic scatterplot.

> <strong>There are 3 plots: </strong><br>
> Plot 1: medalists of selected event with ALL years <br>
> Plot 2: medalists of selected event with SELECTED year <br>
> Plot 3: simulation race

I was able to get Plot 1 working when I realized that in order to get the other plots in the same place, I should be initializing the plot's group/axis in the init function, instead of every time a plot is called. Creating and clearing the axis labels and data points is pretty smooth this way.

When deciding how to display the runners in Plot 2, I decided I liked the idea in the plot from the NYT where the x-axis can convey the distance behind the lead runner:

>http://archive.nytimes.com/www.nytimes.com/interactive/2012/08/05/sports/olympics/the-100-meter-dash-one-race-every-medalist-ever.html?

so I added a "distance run" key, which used the runner's speed and the winner's result.

For Plot 3, I had to get Selector links in the tooltips first, and then built a list of selected runners which could keep getting updated. I resolved the tooltip flickering with a non-ideal solution: I moved the tooltips away from the cursor, and tooltips appear on mouseover, and hide on click.

Once all the plots were working, I focused on aesthetic needs, like clearing data points and axis titles, and making the selecter runners list display nicely. I added a free Bootstrap theme but it didn't do much besides make the "Clear All" and "Simulate Run" buttons look a little nicer.

I found Font Awesome - free vector icons that work like a font (which makes adding color really easy!). The free version has a medal and a running man. The issue this caused when when I wanted to add names to the icons in Plot 3 (otherwise you couldn't identify the runners' places until you mouseover each point for a tooltip). This was fixed by calling separate data points for the runner and the name.

<hr> 

# Stretch Goals

### Achieved:

> Added transitions

> Ability to have duplicates in simulation using runnersList.push(Object.assign({}, data)); instead of just building a list of pointers

### Not yet:

> Brown bar graph behind plots 2 and 3 to give appearance of track lanes.

> D3 character encoding doesn't allow for some of the accents and symbols in runners' names.
