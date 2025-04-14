import * as THREE from 'three';

/**
 * @class {TileSet}
 * @type {TileSet}
 */
class TileSet{
    constructor( name = 'tileset'){
      this._name = name;
      this._tiles = {};
      this._boundary = new TileType('boundary');
    }
    /**
     * @returns {String}
     */
    name(){
      return this._name;
    }
    /**
     * @param {Boolean} list 
     * @returns {TileType[]|Object}
     */
    tiles( list = false ){
        return list ? Object.values( this._tiles ) : this._tiles;
    }
    /**
     * @returns {Boolean}
     */
    empty( ){
        return this.tiles(true).length === 0;
    }
    /**
     * @param {Number} tileId 
     * @returns {TileType}
     */
    get( tileId  = 0){
        return tileId < this.tiles(true).length ? this.tiles(true)[tileId] : null;
    }
    /**
     * @param {String} tile 
     * @returns {Boolean}
     */
    has( tile ){
        return this.tiles().hasOwnProperty(tile);
    }
    /**
     * @param {TileType} tile 
     * @returns {TileSet}
     */
    add( tile){
        if( tile instanceof TileType && !this.has(tile.name())){
            this._tiles[tile.name()] = tile;
        }
        return this;
    }
    /**
     * @returns {TileType}
     */
    boundary(){
        return this._boundary;
    }
  }
  /**
   * @class {DungeonMap}
   * @type {DungeonMap}
   */
  class TileType{
    constructor( name = 'empty' , decay = 0 , density = 100, type = TileType.Type.Solid){
      this._density = density || 100;
      this._decay = decay || 0;
      this._name = name;
      this._type = type || TileType.Type.Solid;
    }
    /**
     * @returns {String}
     */
    name(){
        return this._name;
    }
    /**
     * @returns {String}
     */
    type(){
        return this._type;
    }
    /**
     * @returns {Boolean}
     */
    solid(){
        return this._type === TileType.Type.Solid;
    }
    /**
     * @returns {Boolean}
     */
    walkable(){
        return this._type === TileType.Type.Walkable;
    }
    /**
     * @returns {Boolean}
     */
    liquid(){
        return this._type === TileType.Type.Liquid;
    }

    /**
     * @returns {Number}
     */
    decay(){
        return this._decay;
    }
    /**
     * @returns {Number}
     */
    density(){
        return this._density;
    }
  }
  /**
   * @type {TileType.Type}
   */
  TileType.Type = {
    'Walkable':'walkable',
    'Solid':'solid',
    'Liquid':'liquid',
  };



   
  /**
   * @class {DungeonMap}
   * @type {DungeonMap}
   */
  class DungeonMap {
    
    constructor(width = 32, height = 32, tileSet = null) {
        this._width = width;
        this._height = height;
        this._tileSet = tileSet || new TileSet();
        this._tiles = new Array(width * height);
  
    }
    /**
     * @returns {DungeonMap}
     */
    initialize(){
        for( let i = 0 ; i < this.height() * this.width() ; i++){
            this._tiles[i] = new Tile(i , this);
        }
        return this;
    }
    /**
     * @returns {Number}
     */
    width(){
        return this._width;
    }
    /**
     * @returns {height}
     */
    height(){
        return this._height;
    }
    /**
     * @returns {TileSet}
     */
    tileset(){
        return this._tileSet;
    }
    /**
     * @returns {Tile}
     */
    borderTile(){
        return this.tileset().boundary();
    }
    /**
     * @param {Number} x 
     * @param {Number} y 
     * @returns {Boolean}
     */
    isIn( x , y){
        return this.width() > x && x > -1 && this.height() > y && y > -1;
    }
    /**
     * @param {Number} x 
     * @param {Number} y 
     * @returns {Tile}
     */
    getTile(x = 0, y = 0) {
        return this.isIn( x , y) ? this._tiles[y * this._width + x] : this.borderTile();
    }
    /**
     * @param {Number} index 
     * @returns {Tile}
     */
    get(index = 0) {
        return this._tiles[index] || this.borderTile();
    }
  }
  
  
  /**
   * @class {Tile}
   * @type {Tile}
   */
  class Tile{
    constructor( id = 0 , map = null){
        this.id = id || 0;
        this._map = map || null;
        this._density = 0;
        this._surface = new TileSurface();

        this.initialize();
    }
    /**
     * @returns {Tile}
     */
    initialize(){
        return this;
    }
    /**
     * Rebuild and refresh this tile in display
     * @returns {Tile}
     */
    rebuild(){

        return this;
    }
    /**
     * @returns {Tile}
     */
    north(){
        return this.map().getTile(this.tid() - this.map().width());
    }
    /**
     * @returns {Tile}
     */
    south(){
        return this.map().getTile(this.tid() + this.map().width());        
    }
    /**
     * @returns {Tile}
     */
    east(){
        return this.map().getTile(this.tid() + 1);
    }
    /**
     * @returns {Tile}
     */
    west(){
        return this.map().getTile(this.tid() - 1);
    }

    /**
     * @returns {DungeonMap}
     */
    map(){
        return this._map;
    }
    /**
     * @returns {TileSet}
     */
    tileset(){
        return this.map() && this.map().tileset();
    }
    /**
     * @returns {TileType}
     */
    type(){
        return this.tileset() && this.tileset().get(this.tid());
    }
    /**
     * @returns {Boolean}
     */
    valid(){
        return this.type() instanceof TileType;
    }
    /**
     * @returns {Number}
     */
    tid(){
        return this._id;
    }
    /**
     * @param {Number} id 
     * @returns {Boolean}
     */
    replace( id = 0 ){
        if( id !== this.tid() && this.tileset().get(id) ){
            this._id = id;
            return true;
        }
        return false;
    }
  }

  Tile.Direction = {
    'North':'north',
    'South':'south',
    'East':'east',
    'West':'west',
  };
 

/**
 * @class {TileSurface}
 * @type {TileSurface}
 */
  class TileSurface {
    
    constructor(tile) {
      this._tile = tile;
  
      // Base mesh and vertex data for the tile
      this.base = {
        vertices: [],
        mesh: null
      };
  
      // Cardinal wall surfaces: N, S, E, W
      this.surfaces = {
        north: null,
        south: null,
        east: null,
        west: null
      };
    }
    /**
     * @param {Tile} tile 
     * @returns {TileSurface}
     */
    build( tile ){
        if( tile instanceof Tile ){
            this.attach(tile);
        }
        return this;
    }
  
    /**
     * Attach and align this tile's surfaces with surrounding tile surfaces.
     * Should be called during Tile.rebuild()
     */
    attach( tile ) {  
      // Build top surface
      if (tile.type().walkable() || tile.type().solid()) {
        this.buildTopSurface();
      }
  
      // Check adjacent tiles and build vertical surfaces if needed
      this.attachWall(tile,'north', tile.north());
      this.attachWall(tile,'south', tile.south());
      this.attachWall(tile,'east', tile.east());
      this.attachWall(tile,'west', tile.west());
    }
  
    buildTopSurface() {
      // Generate base top vertices using map decay logic or map’s precomputed grid
      // Snap vertices with adjacent tile to match seams
      // Create mesh and assign to this.base.mesh
    }
  
    attachWall(tile, direction, adjacent) {
      // Skip if not a wall or invalid adjacent
      if (!adjacent.valid()) return;
  
      const adjacentType = adjacent.tile();
  
      if (adjacentType.isWall()) {
        // Build vertical wall surface for this direction
        const decay = Math.min(tile.decay(), adjacentType.decay());
        this.surfaces[direction] = this.buildWallSurface(direction, decay);
      }
    }
  
    buildWallSurface(direction, decayFactor = 0) {
      // Use decay to create irregular vertex positions
      // Attach to current and adjacent tile's base vertices
      // Return surface mesh or data structure
      return {
        vertices: [], // filled with calculated vertex positions
        mesh: null // mesh object if created
      };
    }
  
    clear() {
      // Dispose of all meshes and clear references
      this.base.mesh = null;
      this.surfaces = { north: null, south: null, east: null, west: null };
    }
  }
  