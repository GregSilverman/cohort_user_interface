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

    // Assemble URL payload for Ajax call to API
    // format is atom_part1;atom_part2
    // part1 maintains information for the bucket from which to pull (e.g., lab -> test_code bucket, sex -> demographics)
    // part2 maintains information about the specific bucket attribute/item and criterion by value to pull
    // (e.g, lab -> result_value with double_value = desired value, or demographics -> sex with string_value = m)
    //
    // Each part has three delimited sections (particles) in the format 'type:key;comparator;value', where
    // a) 'type' gives the reference to the type of data and 'key' identifies the bucket name or the bucket attribute name (in API: pulled from the attribute table by attribute_value),
    // b) 'comparator' is the comparison operator and (in API: operation to be performed)
    // c) 'value' is the criterion value (in API: pull attribute name by attribute_value and query by string or double value)
    //
    // Date comparisons are appended to the criterion value
    // They are denoted by the character string DATE
    //
    // Comparator operators are different than the standard
    // mappings to actual attribute names are resolved via a hash lookup
    // comparators for static defaults are set in code below (e.g., blood_pressure/lab)

    // We use the idiom of atomic structure:
    //
    // An atom is comprised of a string of the form atom_part1;atom_part2 -> type:keyA;comparatorA;valueA;type:keyB;comparatorB;valueB
    // where each ';' delimited unit is defined as an atomic particle,
    // thus an atom is made up of 6 particles

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
            type === 'lab' ||
            type === 'sex' ||
            type === 'age') {
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
        else if (key === 'sex' ||
                 key === 'age'){
            atomic_unit += 'demographics';
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
            key === 'blood_pressure_diastolic' ||
            key === 'sex' ||
            key === 'age') {
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

    // Molecules are atoms concatenated by boolean AND or OR, or preceeded by NOT
    make_molecule: function(payload, options, button) {
        var target, // target store for boolean combined statements
            bool_delimiter,
            n = payload.getCount(),
            i = 0,
            j = 1,
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
            console.log('count: ' + payload.getCount())
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
                console.log('j: ' + j);
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

            // add parentheses
            if (j>1) {
                molecule = '(' + molecule + ')';
            }

            // separate all query units by delimiter, except for the last
            if (i < n && options.delimiter !== '~') {
                molecule += bool_delimiter;
                new_criteria += ' ' +
                    bool_operator +
                    ' ';
            } // (A|~A)&~A = ~A
            else if (i === 1 && options.delimiter === '~'){
                molecule = '((' + molecule + '|' +
                    bool_delimiter +
                    molecule + ')'+ '&' +
                    bool_delimiter +
                    molecule + ')';

                new_criteria = ' ' +  bool_operator +  ' ' +
                    new_criteria;
            }

            j += 1

        });

        // insert boolean combination into store
        if (molecule && new_criteria) {

            new_criteria = '(' + new_criteria + ')';

            if (cardioCatalogQT.config.mode === 'test') {
                console.log('new criteria: ' + new_criteria);
                console.log('new molecule: ' + molecule);
                console.log('key: '  + key);
                console.log('bool_op: ' + bool_operator);
            }

            target.add({
                key: key,
                type: bool_operator,
                description: key,
                criteria: new_criteria,
                atom: molecule
            });
            target.sync();

            var grid = button.up('grid'),
            // bind grid store as source
                source = grid.store,
                store = Ext.getStore(source);

            store.clearFilter();
            grid.getStore().load();

            cardioCatalogQT.service.UtilityService.url(button, molecule);

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

            // separate all query units by appropriate boolean operator
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

    // get parent element for pulling correct bucket
    parent_hash: function(type) {

        var map = new Ext.util.HashMap();

        map.add('blood_pressure_systolic', 'blood_pressure');
        map.add('blood_pressure_diastolic', 'blood_pressure');
        map.add('sex', 'demographics');
        map.add('age', 'demographics');
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

    // use for grid display
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

    // use for atomic payload construction
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
            n = store.getCount();

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
    http_auth: function(button) {

        var url = cardioCatalogQT.config.protocol,
            panel = button.up().up().up(),
            user = 'gms',
            pw = 'python';

        var token = user + ':' + pw;
            hash = 'Basic ' + cardioCatalogQT.service.Base64.encode(token);

        url += cardioCatalogQT.config.host;
        url += cardioCatalogQT.config.apiLogin;

        if (cardioCatalogQT.config.mode === 'test') {
            console.log(url);
            console.log('url: ' + url);
            console.log('panel');
            console.log(panel);
        }

        /*Ext.Ajax.on('beforerequest', (function(klass, request) {
            if (request.failure) { // already have auth token: do nothing
                console.log('WTF?!');
                console.log(request);
                return null;
            }
            else { // send auth token
                request.headers.Authorization = hash;

            }
        }), this);*/

        Ext.Ajax.request({
            cors: true,
            type: 'GET',
            useDefaultXhrHeader: false,
            //withCredentials: true,
            url: url,
            headers: {
                'Accept': 'application/json'
            },
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

                    // enable views on success
                    //panel.down('#resultsGrid').enable();
                    panel.down('#searchGrid').enable();
                    panel.down('#demographicGrid').enable();
                    panel.down('#vitalGrid').enable();
                    panel.down('#labGrid').enable();
                    panel.down('#diagnosisGrid').enable();
                    panel.down('#medicationGrid').enable();
                    panel.down('#procedureGrid').enable();

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

            cardioCatalogQT.service.UtilityService.make_molecule(source, options, button);

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

    query_get: function(button){
        var grid = button.up('grid'),
            source, // source store to filter
            url,
            records = [],
            store =  Ext.create('cardioCatalogQT.store.Payload'),
            query = []; // source ids that are filtered

        // bind grid store as source
        source = grid.store;

        if (cardioCatalogQT.config.mode === 'test') {
            console.log('grid');
            console.log(grid);
            console.log(source);
        }

        url = 'http://127.0.0.1:5000/remote_query_get'

        Ext.Ajax.request({
            cors: true,
            useDefaultXhrHeader: false,
            url: url,
            headers: {
                'Accept': 'application/json'
            },
            disableCaching: false,
            success: function (response) {

                if (response.status === 200) {

                    json = Ext.decode(response.responseText);

                    if (cardioCatalogQT.config.mode === 'test') {
                        console.log(json);
                    }

                    // see http://edspencer.net/2009/07/23/ext-js-iterator-functions/
                    for (key in json){
                        var value = json[key];
                        if (cardioCatalogQT.config.mode === 'test') {
                            console.log(value.length);
                        }

                        for (var i=0; i < value.length; i++) {
                            var query = value[i];

                            if (cardioCatalogQT.config.mode === 'test') {
                                console.log('query object');
                                console.log(query);
                                console.log(query.molecule);
                                console.log(query.criteria);
                            }

                            records.push({
                                atom: query.molecule,
                                criteria: query.criteria,
                                type: 'Test',
                                key: 'Test'

                            });

                        };
                    }

                    //update store with data
                    store.add(records);
                    store.sync();


                } else {
                    if (cardioCatalogQT.config.mode === 'test') {
                        console.log('bad http response');
                    }
                }
            },
            failure: function (response) {
                //me.sessionToken = null;
                //me.signInFailure('Login failed. Please try again later.');
            }
        });

        grid.up().down('#searchGrid').getStore().load();
    },

    query_move: function(button){
        var grid = button.up('grid'),
            selection = grid.getSelectionModel().getSelection(),
            source, // source store to filter
            filtered = [],
            url,
            test =  Ext.getStore('Queries'),
            obj, // object to pass to endpoint
            query = []; // source ids that are filtered

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

                obj = {
                    query: {
                        molecule: item.data.atom,
                        criteria: item.data.criteria

                    }

                };

            if (cardioCatalogQT.config.mode === 'test') {
                console.log('TEST');
                console.log(item.data.atom);
                console.log(item.data.criteria);
                console.log('JSON');
                console.log(obj);
            }

                var recordIndex = test.findBy(
                    function(record, id){
                        if(record.get('molecule') === item.data.atom &&
                            record.get('criteria') === item.data.criteria){
                            return true;  // a record with this data exists
                        }

                        return false;  // there is no record in the store with this data

                    }
                );

                if(recordIndex != -1){
                    console.log("We have a duplicate, abort!");
                }
                else {

                    query.push(item.data.atom);
                    query.push(item.data.criteria);

                    url = 'http://127.0.0.1:5000/remote_query_put';

                    Ext.Ajax.request({
                        cors: true,
                        useDefaultXhrHeader: false,
                        url: url,
                        jsonData: obj,
                        headers: {
                            'Accept': 'application/json'
                        },
                        disableCaching: false,
                        success: function (response) {

                            if (response.status === 200) {

                                console.log('happiness')

                            } else {
                                if (cardioCatalogQT.config.mode === 'test') {
                                    console.log('bad http response');
                                }
                            }
                        },
                        failure: function (response) {
                            //me.sessionToken = null;
                            //me.signInFailure('Login failed. Please try again later.');
                        }
                    });
                }

            });


            if (cardioCatalogQT.config.mode === 'test') {
                console.log('filtered');
                console.log(filtered);
                console.log('QUERY')
                console.log(query)

                console.log('updated store')
                console.log(test)
            }

            source.clearFilter(true); // Clears old filters
            source.filter([ // filter on selected array elements
                {
                    filterFn: function(rec) {
                        return Ext.Array.indexOf(filtered, rec.get('id')) != -1;
                    }
                }
            ]);

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

    url: function(button, atom) {

        var url = cardioCatalogQT.config.protocol,
            grid = button.up('grid'),
            selection = grid.getSelectionModel().getSelection(),
            source, // source store to filter
            filtered = []; // source ids that are filtered

        grid.getStore().load();

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
            console.log('atom ' + atom)
        }

        url += cardioCatalogQT.config.host;
        url += cardioCatalogQT.config.apiGetQ;
        url += atom;

        cardioCatalogQT.service.UtilityService.submit_query(url, button, source, atom);

    },

    submit_query: function(url, button, source, atom){

        var auth = sessionStorage.sessionToken + ':unknown',
            hash = 'Basic ' + cardioCatalogQT.service.Base64.encode(auth),
            json = [],
            records = [],
            store =  Ext.create('cardioCatalogQT.store.Results');

        //localStorage.clear();
        store.getProxy().clear();
        store.data.clear();
        store.sync();

        // Make sure current store contents are displayed on grid
        //button.up().up().up().down('#gridTest').getStore().load();

        if (cardioCatalogQT.config.mode === 'test') {
            console.log('call to make url: ' + url);
        }
        // send auth header before Ajax request to disable auth form
        Ext.Ajax.on('beforerequest', (function(klass, request) {
            if (request.failure) { // already have auth token: do nothing
                console.log('WTF 2?!');
                console.log(request);
                return null;
            }
            else { // send auth token
                console.log('Hmmmm!')
                request.headers.Authorization = hash;
            }
        }), this);

        Ext.Ajax.request({
            cors: true,
            url: url,
            useDefaultXhrHeader: true,
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

                    if (cardioCatalogQT.config.mode === 'test') {
                        console.log(records);
                        console.log('store');
                        console.log(store);
                        console.log('N');
                        console.log(store.getCount());
                    }
                }

                // update n in store for grid display
                var update_record = source.findRecord('atom', atom);
                update_record.set('n', store.getCount());
                source.sync();

                // render template
                // clear criteria from store
                //cardioCatalogQT.service.UtilityService.clear_all();
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