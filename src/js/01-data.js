
/* ---------- data ---------- */
/* 2026/27 Premier League clubs: [name, short, kit colour, second colour, team strength, players "Name/POS/rating"].
   Ratings are this game's own estimates. Edit freely to keep squads current. */
const CLUBS = [
  ["Arsenal", "ARS", "#EF0107", "#FFFFFF", 88, "David Raya/GK/88 Illan Meslier/GK/78 William Saliba/DEF/88 Gabriel Magalhães/DEF/87 Jurriën Timber/DEF/85 Piero Hincapié/DEF/83 Riccardo Calafiori/DEF/82 Ben White/DEF/81 Myles Lewis-Skelly/DEF/80 Declan Rice/MID/89 Martin Ødegaard/MID/87 Bruno Guimarães/MID/86 Martín Zubimendi/MID/86 Eberechi Eze/MID/84 Mikel Merino/MID/81 Bukayo Saka/FWD/89 Viktor Gyökeres/FWD/85 Noni Madueke/FWD/82 Kai Havertz/FWD/81 Gabriel Martinelli/FWD/81 Christos Tzolis/FWD/79"],
  ["Aston Villa", "AVL", "#670E36", "#95BFE5", 81, "Emiliano Martínez/GK/84 Ezri Konsa/DEF/82 Pau Torres/DEF/81 Matty Cash/DEF/79 Aaron Wan-Bissaka/DEF/78 Lucas Digne/DEF/78 Ian Maatsen/DEF/78 Tyrone Mings/DEF/77 Taylor Harwood-Bellis/DEF/77 Modou Kéba Cissé/DEF/75 Boubacar Kamara/MID/81 João Gomes/MID/81 Johan Manzambi/MID/80 John McGinn/MID/80 Amadou Onana/MID/80 Ross Barkley/MID/77 Emiliano Buendía/MID/77 Ollie Watkins/FWD/84 Alejandro Garnacho/FWD/80 Ibrahim Mbaye/FWD/76"],
  ["Bournemouth", "BOU", "#DA291C", "#000000", 78, "Đorđe Petrović/GK/79 Michele Di Gregorio/GK/78 António Silva/DEF/80 Adrien Truffert/DEF/78 Bafodé Diakité/DEF/78 Juanlu Sánchez/DEF/77 Tyler Adams/MID/79 Marcus Tavernier/MID/79 Alex Scott/MID/78 Lewis Cook/MID/77 Ryan Christie/MID/77 Justin Kluivert/FWD/80 Evanilson/FWD/80 David Brooks/FWD/76 Álvaro Rodríguez/FWD/76"],
  ["Brentford", "BRE", "#E30613", "#FFFFFF", 78, "Caoimhín Kelleher/GK/81 Nathan Collins/DEF/80 Sepp van den Berg/DEF/78 Michael Kayode/DEF/77 El Hadji Malick Diouf/DEF/77 Kristoffer Ajer/DEF/76 Keane Lewis-Potter/DEF/76 Mikkel Damsgaard/MID/79 Mathias Jensen/MID/77 Yehor Yarmoliuk/MID/77 Fábio Carvalho/MID/76 Jannik Schuster/MID/76 Mamadou Sangaré/MID/76 Igor Thiago/FWD/82 Kevin Schade/FWD/79 Dango Ouattara/FWD/78 Callum Wilson/FWD/76 Jaidon Anthony/FWD/76 Reiss Nelson/FWD/76"],
  ["Brighton", "BHA", "#0057B8", "#FFFFFF", 78, "Bart Verbruggen/GK/80 Pascal Struijk/DEF/78 Maxim De Cuyper/DEF/78 Lewis Dunk/DEF/77 Jaouen Hadjam/DEF/76 Costinha/DEF/76 Michal Svoboda/DEF/76 Mario Vušković/DEF/75 Diego Gómez/MID/78 Yasin Ayari/MID/78 Jack Hinshelwood/MID/77 Chema Andrés/MID/76 Kaoru Mitoma/FWD/81 Yankuba Minteh/FWD/80 Georginio Rutter/FWD/78 Brajan Gruda/FWD/77 Julio Enciso/FWD/76 Tom Watson/FWD/75 Miguel Azeez/MID/75"],
  ["Chelsea", "CHE", "#034694", "#FFFFFF", 85, "Robert Sánchez/GK/81 Reece James/DEF/83 Levi Colwill/DEF/83 Marc Cucurella/DEF/83 Maxence Lacroix/DEF/82 Wesley Fofana/DEF/80 Malo Gusto/DEF/80 Marco Palestra/DEF/80 Benoît Badiashile/DEF/78 Denner/DEF/76 Moisés Caicedo/MID/89 Cole Palmer/MID/88 Morgan Rogers/MID/85 Romeo Lavia/MID/79 Jordan Henderson/MID/76 Estêvão/FWD/85 João Pedro/FWD/83 Pedro Neto/FWD/81 Geovany Quenda/FWD/81 Emanuel Emegha/FWD/79 Jamie Gittens/FWD/78"],
  ["Crystal Palace", "CRY", "#1B458F", "#C4122E", 78, "Dean Henderson/GK/82 Takehiro Tomiyasu/DEF/79 Chris Richards/DEF/79 Tyrick Mitchell/DEF/78 Óscar Mingueza/DEF/78 Chadi Riad/DEF/76 Borna Sosa/DEF/75 Adam Wharton/MID/83 Daichi Kamada/MID/79 Dwight McNeil/MID/78 Jefferson Lerma/MID/77 Cheick Doucouré/MID/77 Will Hughes/MID/76 Jean-Philippe Mateta/FWD/81 Ismaïla Sarr/FWD/81 Eddie Nketiah/FWD/77 Evann Guessand/FWD/77 Anan Khalaili/FWD/76 Zavier Gozo/FWD/74"],
  ["Everton", "EVE", "#003399", "#FFFFFF", 77, "Jordan Pickford/GK/83 James Tarkowski/DEF/80 Jake O'Brien/DEF/78 Vitaliy Mykolenko/DEF/78 Michael Keane/DEF/76 James Garner/MID/79 Kiernan Dewsbury-Hall/MID/79 Christian Nørgaard/MID/78 Hayden Hackney/MID/77 Jack Harrison/MID/75 Tim Iroegbunam/MID/74 Iliman Ndiaye/FWD/81 Brennan Johnson/FWD/80 Merlin Röhl/FWD/78 Thierno Barry/FWD/77 Beto/FWD/76 Tyrique George/FWD/76 Jesper Lindstrøm/FWD/76"],
  ["Fulham", "FUL", "#000000", "#FFFFFF", 77, "Bernd Leno/GK/81 Joachim Andersen/DEF/79 Antonee Robinson/DEF/79 Calvin Bassey/DEF/78 Kenny Tete/DEF/77 Timothy Castagne/DEF/76 Ryan Sessegnon/DEF/76 Emile Smith Rowe/MID/79 Alex Iwobi/MID/79 Sander Berge/MID/78 Josh King/MID/75 Tom Cairney/MID/75 Gonzalo García/FWD/78 Samuel Chukwueze/FWD/77 Adama Traoré/FWD/77 Rodrigo Muniz/FWD/77 Jonah Kusi-Asare/FWD/74"],
  ["Leeds United", "LEE", "#FFFFFF", "#1D428A", 76, "James Trafford/GK/80 Lucas Perri/GK/76 Tarik Muharemović/DEF/78 Joe Rodon/DEF/77 Nico Elvedi/DEF/77 Jayden Bogle/DEF/75 Gabriel Gudmundsson/DEF/75 Ethan Ampadu/MID/78 Anton Stach/MID/77 Brenden Aaronson/MID/76 Ao Tanaka/MID/76 Ilia Gruev/MID/75 Harry Wilson/FWD/78 Noah Okafor/FWD/77 Dominic Calvert-Lewin/FWD/77 Wilfried Gnonto/FWD/77 Daniel James/FWD/76 Lukas Nmecha/FWD/75"],
  ["Liverpool", "LIV", "#C8102E", "#F6EB61", 85, "Alisson/GK/86 Giorgi Mamardashvili/GK/82 Virgil van Dijk/DEF/86 Jérémy Jacquet/DEF/83 Ronald Araújo/DEF/83 Jeremie Frimpong/DEF/82 Milos Kerkez/DEF/81 Joe Gomez/DEF/78 Konstantinos Tsimikas/DEF/77 Florian Wirtz/MID/87 Alexis Mac Allister/MID/86 Ryan Gravenberch/MID/86 Dominik Szoboszlai/MID/85 Curtis Jones/MID/81 Wataru Endo/MID/77 Alexander Isak/FWD/87 Hugo Ekitiké/FWD/84 Cody Gakpo/FWD/83 Víctor Muñoz/FWD/79 Federico Chiesa/FWD/78"],
  ["Manchester City", "MCI", "#6CABDD", "#1C2C5B", 86, "Gianluigi Donnarumma/GK/88 Gerónimo Rulli/GK/81 Joško Gvardiol/DEF/86 Rúben Dias/DEF/85 Marc Guéhi/DEF/84 Rayan Aït-Nouri/DEF/81 Abdukodir Khusanov/DEF/80 Nico O'Reilly/DEF/80 Rico Lewis/DEF/79 Rodri/MID/88 Enzo Fernández/MID/86 Elliot Anderson/MID/86 Phil Foden/MID/85 Rayan Cherki/MID/84 Ayyoub Bouaddi/MID/80 Matheus Nunes/MID/79 Erling Haaland/FWD/92 Antoine Semenyo/FWD/84 Jérémy Doku/FWD/83 Omar Marmoush/FWD/82 Jeremy Monga/FWD/76"],
  ["Manchester United", "MUN", "#DA291C", "#FBE122", 82, "Senne Lammens/GK/80 Karl Darlow/GK/75 Matthijs de Ligt/DEF/81 Lisandro Martínez/DEF/80 Leny Yoro/DEF/80 Diogo Dalot/DEF/79 Noussair Mazraoui/DEF/79 Harry Maguire/DEF/77 Bruno Fernandes/MID/85 Carlos Baleba/MID/82 Youri Tielemans/MID/82 Andrey Santos/MID/80 Kobbie Mainoo/MID/79 Mason Mount/MID/78 Manuel Ugarte/MID/78 Bryan Mbeumo/FWD/84 Matheus Cunha/FWD/83 Benjamin Šeško/FWD/82 Amad Diallo/FWD/80 Joshua Zirkzee/FWD/78"],
  ["Newcastle United", "NEW", "#241F20", "#FFFFFF", 80, "Nick Pope/GK/82 Lukáš Horníček/GK/78 Ewen Jaouen/GK/77 Sven Botman/DEF/81 Malick Thiaw/DEF/80 Tino Livramento/DEF/80 Lewis Hall/DEF/79 Fabian Schär/DEF/78 Dan Burn/DEF/77 Nico González/MID/83 Joelinton/MID/81 Jacob Ramsey/MID/78 Joe Willock/MID/77 Lewis Miley/MID/76 Sean Steur/MID/74 Anthony Elanga/FWD/81 Matías Fernández-Pardo/FWD/80 Yoane Wissa/FWD/80 Bazoumana Touré/FWD/79 Harvey Barnes/FWD/79 Aladji Bamba/FWD/78 Jacob Murphy/FWD/78"],
  ["Nottingham Forest", "NFO", "#DD0000", "#FFFFFF", 79, "Matz Sels/GK/80 Murillo/DEF/82 Nikola Milenković/DEF/81 Daniel Muñoz/DEF/81 Ousmane Diomande/DEF/80 Ola Aina/DEF/78 Neco Williams/DEF/77 Morato/DEF/76 Morgan Gibbs-White/MID/83 Omari Hutchinson/MID/79 Douglas Luiz/MID/78 Ibrahim Sangaré/MID/77 Nicolás Domínguez/MID/76 Ryan Yates/MID/76 Dan Ndoye/FWD/80 Callum Hudson-Odoi/FWD/79 Chris Wood/FWD/78 Igor Jesus/FWD/77 Arnaud Kalimuendo/FWD/77"],
  ["Sunderland", "SUN", "#EB172B", "#FFFFFF", 75, "Robin Roefs/GK/78 Kevin Danso/DEF/78 Omar Alderete/DEF/77 Nordi Mukiele/DEF/77 Thomas Meunier/DEF/77 Dan Ballard/DEF/76 Trai Hume/DEF/76 Luke O'Nien/DEF/74 Granit Xhaka/MID/81 Enzo Le Fée/MID/78 Habib Diarra/MID/77 Noah Sadiki/MID/77 Dan Neil/MID/76 Chris Rigg/MID/75 Patrick Roberts/MID/75 Simon Adingra/FWD/77 Chemsdine Talbi/FWD/77 Wilson Isidor/FWD/76 Eliezer Mayenda/FWD/75 Nilson Angulo/FWD/74"],
  ["Tottenham Hotspur", "TOT", "#132257", "#FFFFFF", 83, "Guglielmo Vicario/GK/82 Martin Dúbravka/GK/78 Micky van de Ven/DEF/85 Cristian Romero/DEF/84 Jan Paul van Hecke/DEF/81 Pedro Porro/DEF/81 Andy Robertson/DEF/80 Marcos Senesi/DEF/79 Destiny Udogie/DEF/79 Tosin Adarabioyo/DEF/78 Sandro Tonali/MID/86 Xavi Simons/MID/82 Dejan Kulusevski/MID/82 James Maddison/MID/81 Pape Matar Sarr/MID/80 Rodrigo Bentancur/MID/79 Yves Bissouma/MID/77 Mohammed Kudus/FWD/83 Savinho/FWD/81 Dominic Solanke/FWD/79 Richarlison/FWD/78 Wilson Odobert/FWD/77 Mykhailo Mudryk/FWD/76"],
  ["Coventry City", "COV", "#59CBE8", "#FFFFFF", 74, "Carl Rushworth/GK/76 Ben Wilson/GK/71 Aurèle Amenda/DEF/76 Ethan Pinnock/DEF/75 Milan van Ewijk/DEF/73 Bobby Thomas/DEF/72 Liam Kitching/DEF/72 Jay Dasilva/DEF/71 Frank Onyeka/MID/76 Caleb Yirenkyi/MID/76 Yann Gboho/MID/75 Jack Rudoni/MID/75 Victor Torp/MID/74 Matt Grimes/MID/73 Josh Eccles/MID/72 Loum Tchaouna/FWD/76 Taiwo Awoniyi/FWD/76 Sidiki Cherif/FWD/75 Haji Wright/FWD/75 Ellis Simms/FWD/74 Tatsuhiro Sakamoto/FWD/74 Ephron Mason-Clark/FWD/73 Brandon Thomas-Asante/FWD/72"],
  ["Hull City", "HUL", "#F5A12D", "#000000", 73, "Jack Butland/GK/75 Konstantinos Tzolakis/GK/75 Nobel Mendy/DEF/75 Matt Targett/DEF/74 Lucas Herrington/DEF/73 Charlie Hughes/DEF/72 Lewie Coyle/DEF/71 Hidemasa Morita/MID/76 Oscar Zambrano/MID/74 Lucas Gourna-Douath/MID/74 Jens Hjertø-Dahl/MID/73 Regan Slater/MID/72 Matt Crooks/MID/71 Steven Alzate/MID/71 Joe Gelhardt/FWD/74 Kyle Joseph/FWD/73 Oli McBurnie/FWD/72"]
];
const POOL = [];
CLUBS.forEach((c,ci)=>{ for(const m of c[5].matchAll(/\s*([^/]+?)\/(GK|DEF|MID|FWD)\/(\d+)/g)) POOL.push({rid:ci+":"+m[1],n:m[1],pos:m[2],ovr:+m[3],club:ci}) });
// --- Future Prospect cards: start at 82, gain +1 overall every season ---
const PROSPECT_BASE=85, PROSPECT_CAP=95;
const PROSPECTS = [
  ["Eli Junior Kroupi","BOU","FWD"],
  ["Rayan","BOU","FWD"],
  ["Ant\u00f3nio Silva","BOU","DEF"],
  ["Archie Gray","TOT","MID"],
  ["Ousmane Diomande","NFO","DEF"],
  ["Max Dowman","ARS","FWD"],
  ["Rio Ngumoha","LIV","FWD"],
  ["JJ Gabriel","MUN","FWD"]
].map(([n,sh,pos])=>({n,pos,club:CLUBS.findIndex(c=>c[1]===sh),rid:"P:"+n}));
// --- Champions League cards: elite stars from Europe's other top leagues ---
const EURO_CLUBS={
  RMA:["#FFFFFF","#00529F","Real Madrid"], BAR:["#004D98","#A50044","Barcelona"],
  BAY:["#DC052D","#FFFFFF","Bayern Munich"], PSG:["#0C1C3C","#DA291C","Paris Saint-Germain"],
  INT:["#0068A8","#000000","Inter Milan"], NAP:["#12A0D7","#FFFFFF","Napoli"],
  MIL:["#FB090B","#000000","AC Milan"], JUV:["#000000","#FFFFFF","Juventus"],
  ATM:["#CB3524","#FFFFFF","Atl\u00e9tico Madrid"], DOR:["#FDE100","#000000","Borussia Dortmund"]
};
const UCL = [
  ["Kylian Mbappé","RMA","FWD",92],["Vinícius Júnior","RMA","FWD",90],["Jude Bellingham","RMA","MID",89],
  ["Federico Valverde","RMA","MID",88],["Thibaut Courtois","RMA","GK",89],["Rodrygo","RMA","FWD",86],
  ["Aurélien Tchouaméni","RMA","MID",85],["Antonio Rüdiger","RMA","DEF",85],
  ["Lamine Yamal","BAR","FWD",90],["Pedri","BAR","MID",88],["Raphinha","BAR","FWD",87],
  ["Robert Lewandowski","BAR","FWD",86],["Frenkie de Jong","BAR","MID",86],["Marc-André ter Stegen","BAR","GK",86],
  ["Gavi","BAR","MID",84],["Pau Cubarsí","BAR","DEF",83],
  ["Harry Kane","BAY","FWD",90],["Jamal Musiala","BAY","MID",88],["Joshua Kimmich","BAY","MID",87],
  ["Michael Olise","BAY","FWD",86],["Dayot Upamecano","BAY","DEF",85],["Alphonso Davies","BAY","DEF",84],["Manuel Neuer","BAY","GK",85],
  ["Ousmane Dembélé","PSG","FWD",89],["Khvicha Kvaratskhelia","PSG","FWD",87],["Vitinha","PSG","MID",87],
  ["Achraf Hakimi","PSG","DEF",86],["Nuno Mendes","PSG","DEF",85],["João Neves","PSG","MID",85],["Désiré Doué","PSG","FWD",84],
  ["Lautaro Martínez","INT","FWD",88],["Nicolò Barella","INT","MID",86],["Hakan Çalhanoğlu","INT","MID",85],
  ["Marcus Thuram","INT","FWD",85],["Federico Dimarco","INT","DEF",84],
  ["Kevin De Bruyne","NAP","MID",87],["Scott McTominay","NAP","MID",83],["Romelu Lukaku","NAP","FWD",83],
  ["Rafael Leão","MIL","FWD",85],["Christian Pulisic","MIL","FWD",84],
  ["Kenan Yıldız","JUV","FWD",84],["Dušan Vlahović","JUV","FWD",83],
  ["Julián Álvarez","ATM","FWD",87],["Antoine Griezmann","ATM","FWD",84],
  ["Serhou Guirassy","DOR","FWD",84]
].map(([n,sh,pos,ovr])=>{const e=EURO_CLUBS[sh];const r=ovr<88?ovr+2:ovr+1;return {n,pos,ovr:r,rid:"U:"+n,csh:sh,k1:e[0],k2:e[1],cname:e[2]};});
// --- European opponents for continental competitions (2026/27): [name, c1, c2, strength, "Player/POS ..."] ---
const EUROTEAMS = {
  RMA:["Real Madrid","#FFFFFF","#00529F",90,"Kylian Mbappé/FWD Vinícius Júnior/FWD Jude Bellingham/MID Federico Valverde/MID Thibaut Courtois/GK Antonio Rüdiger/DEF Rodrygo/FWD"],
  FCB:["Barcelona","#004D98","#A50044",88,"Lamine Yamal/FWD Robert Lewandowski/FWD Pedri/MID Raphinha/FWD Frenkie de Jong/MID Pau Cubarsí/DEF"],
  BAY:["Bayern München","#DC052D","#FFFFFF",88,"Harry Kane/FWD Jamal Musiala/MID Michael Olise/FWD Joshua Kimmich/MID Dayot Upamecano/DEF"],
  PSG:["Paris Saint-Germain","#0C1C3C","#DA291C",88,"Ousmane Dembélé/FWD Khvicha Kvaratskhelia/FWD Vitinha/MID Achraf Hakimi/DEF Désiré Doué/FWD"],
  INT:["Inter","#0068A8","#000000",85,"Lautaro Martínez/FWD Marcus Thuram/FWD Nicolò Barella/MID Hakan Çalhanoğlu/MID Federico Dimarco/DEF"],
  ATM:["Atlético Madrid","#CB3524","#FFFFFF",84,"Julián Álvarez/FWD Antoine Griezmann/FWD Pablo Barrios/MID Robin Le Normand/DEF"],
  NAP:["Napoli","#12A0D7","#FFFFFF",84,"Kevin De Bruyne/MID Scott McTominay/MID Romelu Lukaku/FWD Alessandro Buongiorno/DEF"],
  JUV:["Juventus","#000000","#FFFFFF",83,"Kenan Yıldız/FWD Dušan Vlahović/FWD Manuel Locatelli/MID Gleison Bremer/DEF"],
  LEV:["Bayer Leverkusen","#E32221","#000000",82,"Alejandro Grimaldo/DEF Patrik Schick/FWD Nordi Mukiele/DEF Aleix García/MID"],
  ATA:["Atalanta","#1D71B8","#000000",82,"Ademola Lookman/FWD Charles De Ketelaere/FWD Éderson/MID Gianluca Scamacca/FWD"],
  DOR:["Borussia Dortmund","#FDE100","#000000",82,"Serhou Guirassy/FWD Karim Adeyemi/FWD Julian Brandt/MID Nico Schlotterbeck/DEF"],
  SLB:["Benfica","#E30613","#FFFFFF",81,"Vangelis Pavlidis/FWD Fredrik Aursnes/MID Orkun Kökçü/MID Nicolás Otamendi/DEF"],
  SCP:["Sporting CP","#016A3A","#FFFFFF",81,"Pedro Gonçalves/MID Francisco Trincão/FWD Gonçalo Inácio/DEF Morten Hjulmand/MID"],
  GAL:["Galatasaray","#FDB912","#A90432",80,"Victor Osimhen/FWD Mauro Icardi/FWD Dries Mertens/FWD Lucas Torreira/MID"],
  OLM:["Marseille","#2FAEE0","#103D73",80,"Mason Greenwood/FWD Pierre-Emerick Aubameyang/FWD Adrien Rabiot/MID Leonardo Balerdi/DEF"],
  ASM:["Monaco","#E63312","#FFFFFF",80,"Folarin Balogun/FWD Maghnes Akliouche/MID Takumi Minamino/MID"],
  VIL:["Villarreal","#FFE667","#005187",80,"Nicolas Pépé/FWD Dani Parejo/MID Álex Baena/MID"],
  PSV:["PSV","#ED1C24","#FFFFFF",79,"Ismael Saibari/MID Ricardo Pepi/FWD Luuk de Jong/FWD"],
  AJX:["Ajax","#D2122E","#FFFFFF",78,"Wout Weghorst/FWD Kenneth Taylor/MID Jorrel Hato/DEF"],
  ROM:["Roma","#8E1F2F","#F0BC42",80,"Paulo Dybala/FWD Lorenzo Pellegrini/MID Manu Koné/MID Gianluca Mancini/DEF"],
  POR:["Porto","#003DA5","#FFFFFF",80,"Samu Aghehowa/FWD Pepê/FWD Alan Varela/MID"],
  BET:["Real Betis","#00A651","#FFFFFF",79,"Antony/FWD Isco/MID Giovani Lo Celso/MID"],
  FEN:["Fenerbahçe","#00205B","#FFED00",79,"Youssef En-Nesyri/FWD Anderson Talisca/FWD İrfan Can Kahveci/MID"],
  RSO:["Real Sociedad","#0067B1","#FFFFFF",78,"Mikel Oyarzabal/FWD Takefusa Kubo/FWD Brais Méndez/MID"],
  LYO:["Lyon","#FFFFFF","#DA001A",78,"Malick Fofana/FWD Corentin Tolisso/MID Nicolás Tagliafico/DEF"],
  LIL:["Lille","#E01E24","#FFFFFF",78,"Jonathan David/FWD Hákon Haraldsson/MID Benjamin André/MID"],
  BOL:["Bologna","#1A2F48","#A21C27",78,"Riccardo Orsolini/FWD Santiago Castro/FWD Lewis Ferguson/MID"],
  STU:["Stuttgart","#E32219","#FFFFFF",78,"Deniz Undav/FWD Ermedin Demirović/FWD Angelo Stiller/MID"],
  FEY:["Feyenoord","#E30613","#FFFFFF",78,"Ayase Ueda/FWD Quinten Timber/MID Anis Hadj Moussa/FWD"],
  CLT:["Celtic","#018749","#FFFFFF",77,"Daizen Maeda/FWD Callum McGregor/MID Reo Hatate/MID"],
  FRE:["Freiburg","#000000","#E2001A",77,"Vincenzo Grifo/MID Ritsu Dōan/FWD Matthias Ginter/DEF"],
  BRA:["Braga","#E30613","#FFFFFF",77,"Ricardo Horta/FWD Bruma/FWD João Moutinho/MID"],
  CEL:["Celta Vigo","#8AC3EE","#E53027",77,"Iago Aspas/FWD Borja Iglesias/FWD Óscar Mingueza/DEF"],
  FIO:["Fiorentina","#582C83","#FFFFFF",78,"Moise Kean/FWD Albert Guðmundsson/FWD Rolando Mandragora/MID"],
  RAY:["Rayo Vallecano","#FFFFFF","#E53027",74,"Isi Palazón/MID Jorge de Frutos/FWD Óscar Trejo/MID"],
  AZA:["AZ Alkmaar","#E4001B","#FFFFFF",75,"Troy Parrott/FWD Jordy Clasie/MID Sven Mijnans/MID"],
  SHK:["Shakhtar Donetsk","#FF6600","#000000",76,"Kevin/FWD Georgiy Sudakov/MID Marian Shved/FWD"],
  MAI:["Mainz","#C3141E","#FFFFFF",75,"Jonathan Burkardt/FWD Nadiem Amiri/MID Jae-sung Lee/MID"],
  RAN:["Rangers","#1B458F","#FFFFFF",76,"Cyriel Dessers/FWD Nicolas Raskin/MID James Tavernier/DEF"],
  SAL:["RB Salzburg","#CE0E2D","#FFFFFF",76,"Karim Konaté/FWD Oscar Gloukh/MID Petar Ratkov/FWD"],
  DYN:["Dynamo Kyiv","#FFFFFF","#004B87",73,"Andriy Yarmolenko/FWD Mykola Shaparenko/MID Vladyslav Vanat/FWD"],
  LEG:["Legia Warszawa","#005CA9","#FFFFFF",72,"Marc Gual/FWD Bartosz Kapustka/MID Rafał Augustyniak/DEF"]
};
const EURO_POOL = {
  ucl:["RMA","FCB","BAY","PSG","INT","ATM","NAP","JUV","LEV","ATA","DOR","SLB","SCP","GAL","OLM","ASM","VIL","PSV","AJX"],
  uel:["ROM","POR","BET","FEN","RSO","LYO","LIL","BOL","STU","FEY","CLT","FRE","BRA","CEL","RAN","SAL"],
  uecl:["FIO","RAY","AZA","SHK","MAI","DYN","LEG","CEL","BRA"]
};
const _euroCache={};
function euroTeam(sh){ if(_euroCache[sh]) return _euroCache[sh]; const d=EUROTEAMS[sh]; if(!d) return null;
  const players=[...d[4].matchAll(/\s*([^/]+?)\/(GK|DEF|MID|FWD)/g)].map(m=>({n:m[1],pos:m[2]}));
  return _euroCache[sh]={name:d[0],short:sh,c1:d[1],c2:d[2],str:d[3],players}; }
const FIRST = ["Jamal","Oliver","Mateo","Kofi","Luca","Ethan","Rafael","Tomás","Callum","Yusuf","Niko","Adebayo","Marcus","Leon","Kai","Theo","Ibrahim","Diego","Sami","Jonah","Ruben","Arlo","Emeka","Hugo","Finn","Dario","Kenji","Mateus","Ollie","Bilal","Andrés","Joel","Stellan","Idris","Ciaran","Malik","Pavel","Eli","Felix","Tariq","Nuno","Reece","Sander","Kwame","Elias","Jude","Iker","Milan","Bastian","Omar"];
const LAST = ["Okafor","Hartley","Vidal","Mensah","Brennan","Castell","Lindqvist","Adeyemi","Moreau","Kowal","Ferreira","Ashby","Nakamura","Quinn","Duarte","Halloran","Sesay","Varga","Petrov","Whitlock","Osei","Marchetti","Rowe","Bakker","Iwobi","Santos","Fairley","Novak","Dembélé","Thorne","Kaya","Calloway","Ruiz","Holm","Abara","Lemaire","Prior","Szabo","Eriksen","Banda","Morrow","Takeda","Galván","Strand","Achebe","Pryce","Okoro","Lund","Mbeki","Doherty"];
const POS = ["GK","DEF","MID","FWD"];
const FORMATIONS = {
  "4-3-3":[["GK",50,90],["DEF",15,72],["DEF",38,76],["DEF",62,76],["DEF",85,72],["MID",25,52],["MID",50,56],["MID",75,52],["FWD",20,26],["FWD",50,20],["FWD",80,26]],
  "4-4-2":[["GK",50,90],["DEF",15,72],["DEF",38,76],["DEF",62,76],["DEF",85,72],["MID",14,50],["MID",38,54],["MID",62,54],["MID",86,50],["FWD",36,22],["FWD",64,22]],
  "4-2-3-1":[["GK",50,90],["DEF",15,72],["DEF",38,76],["DEF",62,76],["DEF",85,72],["MID",35,60],["MID",65,60],["MID",20,40],["MID",50,42],["MID",80,40],["FWD",50,20]],
  "4-3-2-1":[["GK",50,90],["DEF",15,72],["DEF",38,76],["DEF",62,76],["DEF",85,72],["MID",25,56],["MID",50,58],["MID",75,56],["MID",35,38],["MID",65,38],["FWD",50,20]],
  "4-1-2-1-2":[["GK",50,90],["DEF",15,72],["DEF",38,76],["DEF",62,76],["DEF",85,72],["MID",50,63],["MID",26,50],["MID",74,50],["MID",50,38],["FWD",38,22],["FWD",62,22]],
  "4-5-1":[["GK",50,90],["DEF",15,72],["DEF",38,76],["DEF",62,76],["DEF",85,72],["MID",12,52],["MID",33,56],["MID",50,50],["MID",67,56],["MID",88,52],["FWD",50,22]],
  "3-5-2":[["GK",50,90],["DEF",28,75],["DEF",50,77],["DEF",72,75],["MID",12,50],["MID",32,55],["MID",50,46],["MID",68,55],["MID",88,50],["FWD",36,22],["FWD",64,22]],
  "3-4-3":[["GK",50,90],["DEF",28,75],["DEF",50,77],["DEF",72,75],["MID",14,52],["MID",38,56],["MID",62,56],["MID",86,52],["FWD",22,24],["FWD",50,20],["FWD",78,24]],
  "5-3-2":[["GK",50,90],["DEF",10,70],["DEF",30,76],["DEF",50,78],["DEF",70,76],["DEF",90,70],["MID",28,52],["MID",50,54],["MID",72,52],["FWD",38,24],["FWD",62,24]]
};
// Each pack is built from explicit tiers: [lo, hi] skews low; [lo, hi, "flat"] is even across the range.
const PACKS = [
  {id:"bronze",name:"Bronze",price:5,count:4,lo:70,hi:80,foil:"f-bronze",desc:["4 players · low-rated pot luck (up to 80)","The cheapest way to fill out a squad"],
    tiers:[[70,79],[70,79],[70,80],[72,80]]},
  {id:"silver",name:"Silver",price:12,count:4,lo:75,hi:83,foil:"f-silver",desc:["4 players, mostly 76–81","One guaranteed 80+"],
    tiers:[[75,80],[75,80],[76,81],[80,83,"flat"]]},
  {id:"gold",name:"Gold",price:45,count:5,lo:77,hi:86,foil:"f-gold",desc:["5 players, mostly 78–83","One guaranteed 84+"],
    tiers:[[77,82],[78,82],[78,83],[81,84],[84,86,"flat"]]},
  {id:"elite",name:"Elite",price:85,count:5,lo:79,hi:91,foil:"f-elite",desc:["5 players: three 79–84, one 85, one 86+","The only pack that can reach the very top"],
    tiers:[[79,84],[79,84],[79,84],[85,85,"flat"],[86,91,"flat"]]}
];
const SWATCHES = ["#e63946","#f4c84b","#2a9d8f","#3a86ff","#8338ec","#ff7b00","#111111","#f5f5f5","#0b6e4f","#7a263a","#00b4d8","#c0c0c0"];
const MAX_SQUAD = 36;
const START_BUDGET = 75;
const CARE = 74; // a youth/caretaker stand-in: an empty slot never drags the team below this

