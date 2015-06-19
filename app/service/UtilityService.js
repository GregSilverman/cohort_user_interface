/**
 * Global functions
 *
 */
Ext.define('cardioCatalogQT.service.UtilityService', {
    singleton : true,
    alias : 'widget.utility',
    constructor: function(config) {
        this.initConfig(config);
    },

    // assemble URL for Ajax call to API
    // format is criterionA_part1;criterionA_part2
    // part1 maintains information for either the bucket from which to pull (e.g., lab -> test_code bucket), or the single attribute bucket from which to pull (e.g., sex = m)
    // part2 maintains information about the specific item and criterion by value to pul (e.g, labs -> result_value compared to desired result, or sex = m)
    // each part has three delimited sections in the format type:key;comparator;value, where type gives the reference to
    // a) type of data and key identifies the bucket name,
    // b) comparator is the comparison operator and
    // c) value is the criterion value
    //
    // Date comparisons are appended to the criterion value
    // They are denoted by the character string DATE
    // TODO: fix below -> in use so that string can be parsed as a date component on its own in the API
    // Comparator operators are different than the standard
    //
    // mappings to actual attribute names are resolved via a hash lookup
    // comparators for static defaults are set in code below (e.g., blood_pressure/lab)

    // TODO: handle creation of boolean combined atomic_units

    make_atom: function(type, key, comparator, value, dateComparator, dateValue) {
        var
            atomic_unit, // = '' each specific item to be queried
            seperator = ':',
            delimiter = ';',
            parent;


        parent = cardioCatalogQT.service.UtilityService.parent_hash(type);

        // section "a" of query
        atomic_unit = type +
            seperator +
            parent +
            delimiter;

        if (key === 'blood_pressure_systolic' ||
            key === 'blood_pressure_diastolic' ||
            type === 'lab') {
            atomic_unit += 'eq';
        }
        else {
            atomic_unit += comparator;
        }

        atomic_unit += delimiter;

        // section "b"
        if (key === 'blood_pressure_systolic' ||
            key === 'blood_pressure_diastolic') {
            atomic_unit += 'blood_pressure';
        }
        else if (type === 'lab') {
            atomic_unit += key;
        }
        else {
            atomic_unit += value;
        }

        atomic_unit += delimiter +
            type +
            seperator;

        if (key === 'blood_pressure_systolic' ||
            key === 'blood_pressure_diastolic') {
            atomic_unit += key;
        }
        else if (type === 'lab') {
            atomic_unit += 'result_value_num';
        }
        else {
            atomic_unit += parent;
        }

        // section "c"
        atomic_unit += delimiter +
            comparator +
            delimiter +
            value;

        // add date here
        if (dateValue){
            atomic_unit += ',DATE,' +
                cardioCatalogQT.service.UtilityService.date_hash(dateComparator) + ',' +
                dateValue
        }

        if (cardioCatalogQT.config.mode === 'test') {
            console.log('atomic_unit');
            console.log(atomic_unit);
        }

        return atomic_unit;
    },

    make_molecule: function(payload, options) {
        var target, // target store for boolean combined statements
            bool_delimiter,
            n = payload.getCount(),
            i = 0,
            new_criteria = '',
            bool_operator,
            molecule = '', // combination of boolean expression and other terms
            key = ''; // grab keys for boolean combined criteria

        if (options.delimiter === '&'){
            bool_delimiter = options.delimiter;
            bool_operator = 'AND';
        }
        else if (options.delimiter === '|') {
            bool_delimiter = options.delimiter;
            bool_operator = 'OR'
        }
        else if (options.delimiter === '~') {
            bool_delimiter = options.delimiter;
            bool_operator = 'NOT'
            console.log('!!!!')
        }

        // set target store to appropriate source
        target = Ext.create('cardioCatalogQT.store.' + payload.storeId);

        if (cardioCatalogQT.config.mode === 'test') {
            console.log('Test payload:');
            console.log(payload);
            console.log('n: ' + n);
            console.log('storeId: ');
            console.log(payload.storeId);
            console.log('target:');
            console.log(target);
        }

        payload.each(function(rec) {

            if (cardioCatalogQT.config.mode === 'test') {
                console.log('payload record');
                console.log(rec.data);
            }

            if (cardioCatalogQT.config.mode === 'test') {
                console.log('criteria record:' + rec.data.criteria);
                console.log('atom record:' + rec.data.atom);
            }

            molecule += rec.data.atom;
            new_criteria += rec.data.criteria;

            // create composite key
            if (i === 0) {
                key = payload.data.items[i].data.id;
            }
            else {
                key += ',' + payload.data.items[i].data.id;
            }

            i += 1;

            // separate all query units by delimiter, except for the last
            if (i < n && options.delimiter !== '~') {
                molecule += bool_delimiter;
                new_criteria += ' ' +
                    bool_operator +
                    ' ';
            }
            else if (i === 1 && options.delimiter === '~'){
                molecule = bool_delimiter +
                    molecule;
                new_criteria = ' ' +  bool_operator +  ' ' +
                    new_criteria;
            }

        });

        // insert boolean combination into store
        if (molecule && new_criteria) {

            // add parentheses
            molecule = '(' + molecule + ')';
            new_criteria = '(' + new_criteria + ')';

            if (cardioCatalogQT.config.mode === 'test') {
                console.log('new criteria: ' + new_criteria);
                console.log('new atom: ' + molecule);
                console.log('key: '  + key);
                console.log('bool_op: ' + bool_operator);
            }

            target.add({
                key: key,
                type: bool_operator,
                criteria: new_criteria,
                atom: molecule
            });
            target.sync();
        }

    },

    // used for display with query results
    criteria: function(payload, options, n){

        var criteria = '',
            comparator,
            date_comparator,
            bool,
            i = 0;

        if (cardioCatalogQT.config.mode === 'test') {
            console.log('Service test:');
            console.log(payload);
        }

        if (!options.delimiter || options.delimiter === ';'){
            bool = 'AND';
        }
        else if (options.delimiter === '|'){
            bool = 'OR';
        }

        payload.each(function(rec) {

            // get symbol for display
            comparator = cardioCatalogQT.service.UtilityService.comparator_hash(rec.data.comparator);
            date_comparator = cardioCatalogQT.service.UtilityService.date_comparator_hash(rec.data.dateComparator);

            if (cardioCatalogQT.config.mode === 'test') {
                console.log('query comparator ');
                console.log(comparator);
                console.log('date comparator ');
                console.log(date_comparator);

            }

            criteria += rec.data.type.toUpperCase() + ' '
                            + ' ' + comparator + ' ' + ' '
                            + rec.data.value + ' ' +  ' '
                            + rec.data.description.toUpperCase();


            if (rec.data.dateValue){
                criteria += ' ' + 'in date range: ' + date_comparator + ' ' + ' '
                    + rec.data.dateValue
            }

            i += 1;

            // separate all query units by appropriate boolean operater
            if (i < n){
                criteria += bool;
            }

            criteria += '<br>';

            if (cardioCatalogQT.config.mode === 'test') {
                console.log('query criteria: ' + criteria);
            }

        });

        return criteria;
    },

    // TODO: ensure payload exists, is clean and does not produce spurious results
    url_request: function(){
        var queries = Ext.getStore('Queries'),
            url = queries.last().data.url;

        if (cardioCatalogQT.config.mode === 'test') {
            console.log('submitted query:');
            console.log(queries.last().data.url);
        }

        return url;

    },

    // get parent element for pulling correct bucket
    parent_hash: function(type) {

        var map = new Ext.util.HashMap();

        map.add('blood_pressure_systolic', 'blood_pressure');
        map.add('blood_pressure_diastolic', 'blood_pressure');
        map.add('sex', 'sex');
        map.add('age','age');
        map.add('dx', 'dx_code');
        map.add('lab', 'test_code');
        map.add('px', 'proc_code');
        map.add('rx', 'drug_code');

        if (cardioCatalogQT.config.mode === 'test') {
            console.log('parent');
            console.log(type);
            console.log(map.get(type));
        }

        return map.get(type);

    },

    // get symbol for display
    comparator_hash: function(type) {

        var map = new Ext.util.HashMap();

        map.add('eq', '=');
        map.add('lt', '<');
        map.add('le', '<=');
        map.add('gt', '>');
        map.add('ge', '>=');
        map.add('bt', 'between');

        if (cardioCatalogQT.config.mode === 'test') {
            console.log('parent');
            console.log(type);
            console.log(map.get(type));
        }

        return map.get(type);

    },

    date_comparator_hash: function(type) {

        var map = new Ext.util.HashMap();

        map.add('le', 'before');
        map.add('ge', 'after');
        map.add('bt', 'between');

        if (cardioCatalogQT.config.mode === 'test') {
            console.log('parent');
            console.log(type);
            console.log(map.get(type));
        }

        return map.get(type);

    },

    date_hash: function(type) {

        var map = new Ext.util.HashMap();

        map.add('le', 'less');
        map.add('ge', 'greater');
        map.add('bt', 'between');

        if (cardioCatalogQT.config.mode === 'test') {
            console.log('parent');
            console.log(type);
            console.log(map.get(type));
        }

        return map.get(type);

    },

    template: function(panel, store) {
        var tpl,
            n = store.getCount(),
            queries = Ext.getStore('Queries'),
            criteria = queries.last().data.criteria;

        if (cardioCatalogQT.config.mode === 'test') {
            console.log('n: ' + n);
        }
        // bind store to form panel
        panel.setData(store);

        tpl = new Ext.XTemplate(
            '<table border=\'\1\'\ style=\'\width:25%\'\>',
                '<tr>',
                    '<td>sid</td>',
                '</tr>',
                '<tpl for=".">',
                    '<tr>',
                        '<td>{data.sid}</td>',
                    '</tr>',
                '</tpl>',
            '</table>'
        );
        // render template with store data to panel using HTML and remove mask from parent object

        if (cardioCatalogQT.config.mode === 'test') {
            console.log('submitted criteria:');
            console.log(criteria);
        }

        panel.setHtml(n + ' patients met the given criteria:'
                            + '<br>'
                            //+ criteria
                            + '<br>'
                            + tpl.apply(store));

        return n;
    },

    criteria_template: function(panel, store) {
        var tpl;

        // bind store to form panel
        panel.setData(store);

        tpl = new Ext.XTemplate(
            '<table border=\'\1\'\ style=\'\width:25%\'\>',
                '<tr>',
                    '<td>CRITERIA</td>',
                '</tr>',
                '<tpl for=".">',
                    '<tr>',
                    // '<td>{data.sid}</td>',
                        '<tpl if="data.type === \'dx\' || data.type === \'px\' || data.type === \'rx\' ">',
                            '<td>{data.type} {data.comparatorSymbol} {data.description}</td>',
                        '<tpl elseif="data.type === \'lab\'">',
                            '<td> {data.description} {data.comparatorSymbol} {data.value}</td>',
                        '<tpl else>',
                            '<td>{data.type} {data.comparatorSymbol} {data.value}</td>',
                        '</tpl>',
                    '</tr>',
                '</tpl>',
            '</table>'
        );
        // render template with store data to panel using HTML and remove mask from parent object

        if (cardioCatalogQT.config.mode === 'test') {
            console.log('submitted criteria:');
            console.log(store);
        }

        panel.setHtml(tpl.apply(store)); //TODO: add criteria on which query was executed
    },

    clear_all: function() {
        var Payload = Ext.getStore('Payload');

        Payload.getProxy().clear();
        Payload.data.clear();
        Payload.sync();

        if (cardioCatalogQT.config.mode === 'test') {
            console.log('Cleared!');
        }
    },

    // get and store token
    http_auth: function() {

        var url = cardioCatalogQT.config.protocol;

        url += cardioCatalogQT.config.host;
        url += cardioCatalogQT.config.apiLogin;

        if (cardioCatalogQT.config.mode === 'test') {
            console.log(url);
            console.log('url: ' + url);
        }

        Ext.Ajax.on('beforerequest', (function(klass, request) {
            if (request.failure) { // already have auth token: do nothing
                return null;
            }
            else { // send auth token
                return null; //request.headers.Authorization = hash;
            }
        }), this);

        Ext.Ajax.request({
            cors: true,
            type: 'GET',
            useDefaultXhrHeader: false,
            url: url,
            disableCaching: false,
            success: function (response) {

                var loginResponse = Ext.JSON.decode(response.responseText),
                    sessionToken;

                if (cardioCatalogQT.config.mode === 'test') {
                    console.log(loginResponse.token);
                }

                sessionStorage.sessionToken = loginResponse.token;

                if (response.status === 200) {
                    // The server will send a token that can be used throughout the app to confirm that the user is authenticated.
                    sessionToken = loginResponse.token;
                    // TODO: write to sessionStorage
                    sessionStorage.sessionToken =  sessionToken;

                    if (cardioCatalogQT.config.mode === 'test') {
                        console.log(sessionToken);
                    }
                } else {
                    if (cardioCatalogQT.config.mode === 'test') {
                        console.log('bad http response');
                        console.log(loginResponse.message);
                    }
                }
            },
            failure: function (response) {
                //me.sessionToken = null;
                //me.signInFailure('Login failed. Please try again later.');
            }
        });

    },

    // customized search, as per http://stackoverflow.com/questions/28974034/multiselect-search-whole-string
    multi_select_search: function(text,me) {

        var filter = me.searchFilter,
            filters = me.getSearchStore().getFilters();

        if (text) {
            filters.beginUpdate();

            if (filter) {
                filter.setValue(text);
            } else {
                me.searchFilter = filter = new Ext.util.Filter({
                    id: 'search',
                    property: me.field,
                    value: text,
                    anyMatch: true
                });
            }

            filters.add(filter);

            filters.endUpdate();
        } else if (filter) {
            filters.remove(filter);
        }
    },

    assemble_boolean: function(button, options){
        var grid = button.up('grid'),
            selection = grid.getSelectionModel().getSelection(),
            source, // source store to filter
            filtered = []; // source ids that are filtered

        // bind grid store as source
        source = grid.store;

        if (cardioCatalogQT.config.mode === 'test') {
            console.log('grid');
            console.log(grid);
            console.log('selection');
            console.log(selection);
            console.log('store');
            console.log(source);
            console.log('storeId');
            console.log(grid.store.storeId);
        }

        if (selection) {

            // array of elements on which to filter
            Ext.Array.each(selection, function (item) {
                filtered.push(item.data.id);
            });

            if (cardioCatalogQT.config.mode === 'test') {
                console.log('filtered');
                console.log(filtered);
            }

            source.clearFilter(true); // Clears old filters
            source.filter([ // filter on selected array elements
                {
                    filterFn: function(rec) {
                        return Ext.Array.indexOf(filtered, rec.get('id')) != -1;
                    }
                }
            ]);

            cardioCatalogQT.service.UtilityService.make_molecule(source, options);

            if (cardioCatalogQT.config.mode === 'test') {
                console.log('filtered store');
                console.log(source);
            }
        }
        else {
            if (cardioCatalogQT.config.mode === 'test') {
                console.log('nada')
            }
        }

    },

    submit_query: function(button, url){

        var auth = sessionStorage.sessionToken + ':unknown',
            hash = 'Basic ' + cardioCatalogQT.service.Base64.encode(auth),
            panel = button.up().up().up().down('#results'),
            json = [],
            records = [],
        //payload = Ext.getStore('Payload'),
        //url,
            store =  Ext.create('cardioCatalogQT.store.Results');
        /*options = {
         delimiter: null
         };*/

        //localStorage.clear();
        store.getProxy().clear();
        store.data.clear();
        store.sync();

        // Make sure current store contents are displayed on grid
        //button.up().up().up().down('#gridTest').getStore().load();

        if (cardioCatalogQT.config.mode === 'test') {
            console.log('component: ');
            console.log(panel);
        }

        /*      // construct URL and submit criteria to Query store
         // if no criteria have been selected then run the last generated query
         if (payload.getCount() > 0) {
         url = cardioCatalogQT.service.UtilityService.url(payload, options);
         }
         // get last submitted url
         else {
         url = cardioCatalogQT.service.UtilityService.url_request();
         l     }*/

        if (cardioCatalogQT.config.mode === 'test') {
            console.log('call to make url: ' + url);
        }

        panel.setMasked({
            xtype: 'loadmask',
            message: 'Loading...'
        });

        // send auth header before Ajax request to disable auth form
        Ext.Ajax.on('beforerequest', (function(klass, request) {
            if (request.failure) { // already have auth token: do nothing
                return null;
            }
            else { // send auth token
                return null; //request.headers.Authorization = hash;
            }
        }), this);

        Ext.Ajax.request({
            cors: true,
            url: url,
            useDefaultXhrHeader: false,
            headers: {
                'Accept': 'application/json'
            },
            disableCaching: false,
            success: function(response) {
                json = Ext.decode(response.responseText);
                if (cardioCatalogQT.config.mode === 'test') {
                    console.log('json' + json);
                }

                if(json !== null &&  typeof (json) !==  'undefined'){

                    // custom JSON reader as per
                    // http://stackoverflow.com/questions/11159480/sencha-touch-store-json-file-containing-array
                    Ext.each(json, function(entry) {
                        Ext.each(json.items || [], function(tuple) {

                            records.push({
                                N: tuple[0].N,
                                sid: tuple[0].sid,
                                source: tuple[0].source
                            });
                            if (cardioCatalogQT.config.mode === 'test') {
                                console.log(tuple[0].source
                                    + 'N ' + tuple[0].N
                                    + 'attribute ' + tuple[0].attribute
                                    + 'sid ' + tuple[0].sid
                                    + 'value ' + tuple[0].value);
                            }
                        });
                    });

                    //update store with data
                    store.add(records);
                    store.sync();

                    // reload store for grid display
                    //button.up().up().up().down('#gridTest').getStore().load();

                    if (cardioCatalogQT.config.mode === 'test') {
                        console.log(records);
                        console.log('store');
                        console.log(store);
                        console.log(button.up().up().up().down('#gridTest').getStore().load());
                    }
                }
                // render template
                cardioCatalogQT.service.UtilityService.template(panel, store);
                // clear criteria from store
                cardioCatalogQT.service.UtilityService.clear_all();
            }
        });
    },

    query_test: function(button, url, id){

        var auth = sessionStorage.sessionToken + ':unknown',
            hash = 'Basic ' + cardioCatalogQT.service.Base64.encode(auth),
            json = [],
            panel = button.up().up().up().down('#results'),
            records = [],
            n,
            store =  Ext.create('cardioCatalogQT.store.Results'),
            test = Ext.getStore('DemographicsPayload');

        //localStorage.clear();
        store.getProxy().clear();
        store.data.clear();
        store.sync();

        if (cardioCatalogQT.config.mode === 'test') {
            console.log('component: ');
            console.log(panel);
        }

        // Make sure current store contents are displayed on grid
        //button.up().up().up().down('#gridTest').getStore().load();


        if (cardioCatalogQT.config.mode === 'test') {
            console.log('call to make url: ' + url);
        }

        // send auth header before Ajax request to disable auth form
        Ext.Ajax.on('beforerequest', (function(klass, request) {
            if (request.failure) { // already have auth token: do nothing
                return null;
            }
            else { // send auth token
                return null; //request.headers.Authorization = hash;
            }
        }), this);

        Ext.Ajax.request({
            cors: true,
            url: url,
            useDefaultXhrHeader: false,
            headers: {
                'Accept': 'application/json'
            },
            disableCaching: false,
            success: function(response) {
                json = Ext.decode(response.responseText);
                if (cardioCatalogQT.config.mode === 'test') {
                    console.log('json' + json);
                }

                if(json !== null &&  typeof (json) !==  'undefined'){

                    // custom JSON reader as per
                    // http://stackoverflow.com/questions/11159480/sencha-touch-store-json-file-containing-array
                    Ext.each(json, function(entry) {
                        Ext.each(json.items || [], function(tuple) {

                            records.push({
                                N: tuple[0].N,
                                sid: tuple[0].sid,
                                source: tuple[0].source
                            });
                            if (cardioCatalogQT.config.mode === 'test') {
                                console.log(tuple[0].source
                                    + 'N ' + tuple[0].N
                                    + 'attribute ' + tuple[0].attribute
                                    + 'sid ' + tuple[0].sid
                                    + 'value ' + tuple[0].value);
                            }
                        });
                    });

                    //update store with data
                    store.add(records);
                    store.sync();

                    // reload store for grid display
                    //button.up().up().up().down('#gridTest').getStore().load();

                    if (cardioCatalogQT.config.mode === 'test') {
                        console.log(records);
                        console.log('store');
                        console.log(store);
                        console.log(store.getCount());
                    }

                }

                // get n for update of store attribute
                n = cardioCatalogQT.service.UtilityService.template(panel, store);

                if (cardioCatalogQT.config.mode === 'test') {
                    console.log('n is -> ' + n);
                }

                var update_record = test.findRecord('id', id);
                update_record.set('n', n);
                test.sync();

            }
        });

    }


});