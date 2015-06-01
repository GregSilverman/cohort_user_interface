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
    url: function(payload, options) {
        var queries = Ext.create('cardioCatalogQT.store.Queries'),
            demo_test = Ext.create('cardioCatalogQT.store.DemographicsPayload'),
            url =  cardioCatalogQT.config.protocol,
            url_payload = '',
            atomic_unit, // = '' each specific item to be queried
            atoms = Ext.create('cardioCatalogQT.store.Atoms'), // store of atomic_units
            store = Ext.create('cardioCatalogQT.store.Results'),
            seperator = ':',
            bool_delimiter,
            delimiter = ';',
            n = payload.getCount(),
            m,
            i = 0,
            parent,
            key = '', // grab keys for boolean combined criteria
            bool_op; // flag type of operator for testing

        if (!options.delimiter || options.delimiter === ';'){
            bool_delimiter = ';';
            bool_op = 'AND';
        }
        else{
            bool_delimiter = options.delimiter;
            bool_op = 'OR'
        }

        if (cardioCatalogQT.config.mode === 'test') {
            console.log('URL payload:')
            console.log(payload);
            console.log('n: ' + n);
            console.log('delimiter: ' + delimiter);
        }

        url += cardioCatalogQT.config.host
            + cardioCatalogQT.config.apiGetQ;

        payload.each(function(rec) {
            // get parent value for assembling bucket query in API
            parent = cardioCatalogQT.service.UtilityService.parent_hash(rec.data.type);

            //atomic_unit = '';

            // section "a" of query
            atomic_unit = rec.data.type +
                seperator  +
                parent +
                delimiter;

            if (payload.data.items[i].data.key === 'blood_pressure_systolic' ||
                    payload.data.items[i].data.key === 'blood_pressure_diastolic' ||
                    payload.data.items[i].data.type === 'lab') {
                atomic_unit += 'eq';
            }
            else {
                atomic_unit  += rec.data.comparator;
            }

            atomic_unit += delimiter;

            // section "b"
            if (payload.data.items[i].data.key === 'blood_pressure_systolic' ||
                payload.data.items[i].data.key === 'blood_pressure_diastolic'){
                atomic_unit += 'blood_pressure';
            }
            else if (payload.data.items[i].data.type === 'lab') {
                atomic_unit += rec.data.key;
            }
            else {
                atomic_unit += rec.data.value;
            }

            // add date here
            if (payload.data.items[i].data.dateValue){
                atomic_unit += ',DATE,' +
                    cardioCatalogQT.service.UtilityService.date_hash(rec.data.dateComparator) + ',' +
                    payload.data.items[i].data.dateValue;
            }

            atomic_unit +=  delimiter +
                rec.data.type +
                seperator;

            if (payload.data.items[i].data.key === 'blood_pressure_systolic' ||
                payload.data.items[i].data.key === 'blood_pressure_diastolic'){
                atomic_unit += payload.data.items[i].data.key;
            }
            else if (payload.data.items[i].data.type === 'lab') {
                atomic_unit += 'result_value_num';
            }
            else {
                atomic_unit += parent;
            }

            // section "c"
            atomic_unit += delimiter +
                rec.data.comparator +
                delimiter +
                rec.data.value;

            // add date here
            if (payload.data.items[i].data.dateValue){
                atomic_unit += ',DATE,' +
                    cardioCatalogQT.service.UtilityService.date_hash(rec.data.dateComparator) + ',' +
                    payload.data.items[i].data.dateValue
            }

            // assemble multi-instance keys for boolean combined model instances
            if (cardioCatalogQT.config.mode === 'test') {
                console.log('store id');
                console.log(payload.data.items[i].data.id);

                if (i === 0){
                    key = payload.data.items[i].data.id;
                }
                else {
                    key += ',' + payload.data.items[i].data.id;
                }
                console.log(key);
                console.log('atomic_unit');
                console.log(atomic_unit);
            }


            var test = url + atomic_unit;

            if (cardioCatalogQT.config.mode === 'test') {
                console.log('test url');
                console.log(test);
            }
            //cardioCatalogQT.service.UtilityService.query_test(test);

            atoms.add({
                type: rec.data.type,
                key: payload.data.items[i].data.id,
                atomic_unit: atomic_unit,
                criteria: cardioCatalogQT.service.UtilityService.criteria(payload, options, n)
            });

            atoms.sync();

            if (cardioCatalogQT.config.mode === 'test') {
                console.log('atoms');
                console.log(atoms);
            }

            url_payload += atomic_unit;

            i += 1;

            // separate all query units by delimiter, except for the last
            if (i < n){
                url_payload += bool_delimiter;
            }
        });

        // deal with boolean combinations
        if (cardioCatalogQT.service.UtilityService.criteria(payload, options, n)) {

            demo_test.add({
                key: key,
                type: bool_op,
                criteria: cardioCatalogQT.service.UtilityService.criteria(payload, options, n)
            });

            demo_test.sync();
            demo_test.last(); // get last inserted id for creation of boolean atomic store record

            if (cardioCatalogQT.config.mode === 'test') {
                console.log('demo_test');
                console.log(demo_test.last().id);
            }
        }

        if (url_payload) {

            atoms.add({
                type: 'boolean',
                key: demo_test.last().id,
                atomic_unit: url_payload,
                criteria: cardioCatalogQT.service.UtilityService.criteria(payload, options, n)
            });

            atoms.sync();
        }


        if (cardioCatalogQT.config.mode === 'test') {
            console.log('url_payload');
            console.log(url_payload);
        }

        url += url_payload;

        // save criteria in data store
        queries.add({
            url: url,
            user: 'gms',
            criteria: cardioCatalogQT.service.UtilityService.criteria(payload, options, n)
        });

        queries.sync();


        if (cardioCatalogQT.config.mode === 'test') {
            // get the last inserted url
            console.log(queries.last());
            console.log(queries.last().data.url);
            console.log(queries.last().data.criteria);
        }

        return url;
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

    assemble_bool: function(button, options){
        var grid = button.up('grid'),
            selection = grid.getSelectionModel().getSelection(),
            store = Ext.getStore('Payload'),
            test_store = Ext.getStore('DemographicsPayload'),
            test = [];

        if (cardioCatalogQT.config.mode === 'test') {
            console.log('grid');
            console.log(grid);
            console.log('selection');
            console.log(selection);
            console.log('store');
            console.log(store);
        }

        if (selection) {

            // array of elements on which to filter
            Ext.Array.each(selection, function (item) {
                test.push(item.data.id);
            });

            if (cardioCatalogQT.config.mode === 'test') {
                console.log('test');
                console.log(test);
            }

            store.clearFilter(true); // Clears old filters
            store.filter([ // filter on selected array elements
                {
                    filterFn: function(rec) {
                        return Ext.Array.indexOf(test, rec.get('id')) != -1;
                    }
                }
            ]);

            test_store.clearFilter(true); // Clears old filters
            test_store.filter([ // filter on selected array elements
                {
                    filterFn: function(rec) {
                        return Ext.Array.indexOf(test, rec.get('id')) != -1;
                    }
                }
            ]);
            // create URL
            cardioCatalogQT.service.UtilityService.url(store,options);

            cardioCatalogQT.service.UtilityService.url(test_store,options);

            if (cardioCatalogQT.config.mode === 'test') {
                console.log('filtered store');
                console.log(store);
                console.log('url');
                console.log(cardioCatalogQT.service.UtilityService.url(store,options));
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