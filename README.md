# Seattle Housing Permit Supply & Population Map Dashboard

**_Created by_** Travis Lee, Kevin Chao, and Kaitlyn Billington

## URLs
https://tralee10.github.io/SEA_Housing_Map/index.html

## Project Overview
This project aims to provide insight into how effectively housing development responds to demographic changes. By visualizing these relationships spatially, users can better understand where housing supply may be keeping up with demand and where gaps may exist. The broader impact includes improving transparency in housing development patterns and potentially informing city planners, policymakers, researchers, and residents.

### Key Objectives
- Increase public awareness of traffic hazards.
- Help city planners make data-driven urban planning decisions.
- Enable drivers and commuters to navigate more safely.

### Target Audience
- **Seattle City Planners**: utilizing the map for informed decision-making when planning future developments.
- **Housing Policy Researchers**: assessessing the data to understand housing trends in reference to population data.
- **Students & General Public**: exploring the map for personal or educational purposes, getting a better idea of what is going on within different communities.

## Features & Functionality

**Cloropleth Map**
> - The choropleth map displays Seattle’s population distribution by census tract.
> - Each tract is shaded according to its total population, with darker colors indicating higher population counts.
> - Quickly identify densely populated neighborhoods, compare population levels across the city, and explore how population patterns relate to housing development and urban growth.

**Heatmap**
> - The heatmap visualizes population density across Seattle’s census tracts, with darker areas representing higher concentrations of residents.
> - Allows users to see where communities are most densely populated, highlighting patterns of urban settlement and areas of lower population across the city.

**Time-Based Sliders**
> - The **Year Issued** slider alters which points are shown on the map based on the year in which the building permit was issued. 
> - The **Year Finished** slider alters which points are shown on the map based on the year in which the building was completed.

**Dropdown Menus**
> - The **Permit Type** dropdown filters the data being viewed at one time based on the type of permit they have, either construction or demolition.
> - The **Dwelling Type** dropdown filters the data being viewed at one time based on the type of dwelling being built. This includes things like "Detached Single-Family", "Apartment", "Accessory Dwelling, Attached", etc.
> - The **Neighborhood** dropdown filters the data being viewed at one time based on the neighborhood that the permits are set in. In Seattle, this includes places like "Northeast", "Northwest", and "Ballard".
> - The **Urban Village** dropdown filters the data being viewed at one time based on the urban village that the permits are set in. In Seattle, this includes places like "University District Northwest", "Roosevelt", and "Capitol Hill".

**Dynamic Bar Chart**
> - The dynamic bar chart shows the most common locations for new housing units.
> - Chart updates based on the **Year**, **Permit Type**, **Dwelling Type**, **Neighborhood**, and/or **Urban Village** that is selected.


## Screenshots
#### The following images illustrate the key features of the Seattle Housing Permit Supply & Population Map Dashboard:

### Proportional Symbols Map
![image](img/house_map.png)

## Heatmap
![image](img/house_heatmap.png)

## Cloropleth Map
![image](img/pop_cloro.png)

### Functions Bar (Switch Between Heatmap/Proportional Symbols Map Button, Time Slider, Dropdown Menus, Dynamic Bar Chart, Reset Map Button)
![image](img/house_func.png)

### Dynamic Chart
![image](img/house_chart.png)

### Pop-Up Details
![image](img/house_popup.png)
![image](img/pop_popup.png)


## Data
### Sources
[**Built Units Since 2010**](https://data-seattlecitygis.opendata.arcgis.com/datasets/SeattleCityGIS::built-units-since-2010/about): Records from the City of Seattle. Includes building permits assigned for creating or demolishing housing units from 2010-2020. This dataset came from the the _Seattle GeoData Portal_ and was cleaned to create our [```built_units.csv```](assets/built_units.csv) and [```built_units.geojson```](assets/built_units.geojson) files located in the assets folder.

[**2010 Census Tract Seattle - Population Statistics**](https://data-seattlecitygis.opendata.arcgis.com/datasets/SeattleCityGIS::2010-census-tract-seattle-population-statistics/about): Census tract population statistics in 2010 of Seattle. This dataset came from the the _Seattle GeoData Portal_ and was cleaned to create our [```2010_pop_tract.csv```](assets/2010_pop_tract.csv) and [```2010_pop_tract.geojson```](assets/2010_pop_tract.geojson) files located in the assets folder.

## Applied Libraries and Web Services
- **JavaScript, HTML, CSS**: Provides the structure and styling for the web application.
- **Mapbox GL JS**: Handles rendering of the interactive map and geospatial visualizations.
- **GeoJSON** - Used for storing and displaying spatial data.
- **Chart.js**: Used to display statistical charts in dashboard.
- **github**: Used to publish webpage.

## Acknowledgements

### Inspirations & References
This project is inspired by:
- **US Hospital Facility Bed Capacity Map** by CovidCareMap [View Web Page](https://www.covidcaremap.org/maps/us-healthcare-system-capacity/#3.5/38/-96) 
- **Mapping Neighborhoods with the Highest Risk of Housing Instability and Homelessness** by Urban Institute [View Web Page](https://www.urban.org/data-tools/mapping-neighborhoods-highest-risk-housing-instability-and-homelessness)


### AI Acknowledgement
_ChatGPT was used to create the [```favicon.png```](img/map_favicon.png) and to help debug code._
