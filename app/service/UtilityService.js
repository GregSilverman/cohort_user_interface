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

            var payload = {
                key: key,
                type: bool_operator,
                description: key,
                criteria: new_criteria,
                atom: molecule
            };

            var grid = button.up('grid'),
                // bind grid store as source
                source = grid.store,
                store = Ext.getStore(source);

            store.clearFilter();
            grid.getStore().load();

            cardioCatalogQT.service.UtilityService.url(button, molecule, 'NULL', payload);

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
        map.add('pr', 'all');

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

    query_move: function(button){
        var grid = button.up('grid'),
            selection = grid.getSelectionModel().getSelection(),
            source, // source store to filter
            filtered = [],
            url = cardioCatalogQT.config.protocol,
            test =  Ext.getStore('Queries'),
            obj, // object to pass to endpoint
            query = []; // source ids that are filtered

        // bind grid store as source
        source = grid.store;

        url += cardioCatalogQT.config.host;
        url += cardioCatalogQT.config.apiWriteQ;

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

        // TODO: add comments
        Ext.Msg.prompt('Name', 'Please enter name to save query as:', function(btn, text) {
            if (btn == 'ok') {
                // process text value and close...

                console.log('query name:')
                console.log(text);

                if (selection) {

                    console.log('A' + text);
                    // array of elements on which to filter
                    Ext.Array.each(selection, function (item) {
                        filtered.push(item.data.id);

                        obj = {
                            query: {
                                molecule: item.data.atom,
                                criteria: item.data.criteria,
                                query_name: text
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
                            function (record, id) {
                                if (record.get('molecule') === item.data.atom &&
                                    record.get('criteria') === item.data.criteria) {
                                    return true;  // a record with this data exists
                                }

                                return false;  // there is no record in the store with this data

                            }
                        );

                        // TODO: give option to add as update
                        if (recordIndex != -1) {
                            console.log("We have a duplicate, abort!");
                        }
                        else {

                            query.push(item.data.atom);
                            query.push(item.data.criteria);

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
                            filterFn: function (rec) {
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
            }

            var //source = grid.store,
                store = Ext.getStore(source);

            store.clearFilter();
            grid.getStore().load();
        });

    },

    url: function(button, atom, from, payload){

        var url = cardioCatalogQT.config.protocol,
            grid = button.up('grid'),
            selection = grid.getSelectionModel().getSelection(),
            source;

        console.log(Ext.ComponentQuery.query('#searchGrid')[0].getStore());

        if (from == 'submitSaved') {
            source = Ext.ComponentQuery.query('#searchGrid')[0].getStore();
        }
        else {
            source = grid.store;
        }

        if (cardioCatalogQT.config.mode === 'test') {
            console.log('from:');
            console.log(from);
            console.log('grid');
            console.log(grid);
            console.log('selection');
            console.log(selection);
            console.log('store');
            console.log(source);
            console.log('storeId');
            console.log(grid.store.storeId);
            console.log('atom ' + atom);
        }

        url += cardioCatalogQT.config.host;
        url += cardioCatalogQT.config.apiGetQ;
        url += atom;

        cardioCatalogQT.service.UtilityService.submit_query(url, source, atom, payload);

    },

    submit_query: function(url, source, atom, test){

        var json = [],
            records = [],
            store =  Ext.create('cardioCatalogQT.store.Results');

        store.getProxy().clear();
        store.data.clear();
        store.sync();

        if (cardioCatalogQT.config.mode === 'test') {
            console.log('call to make url: ' + url);
        }

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
                        console.log(test.atom);
                    }


                    source.add({
                        key: test.key,
                        type: test.type,
                        description: test.description,
                        criteria: test.criteria,
                        atom: test.atom,
                        n:  store.getCount()
                    });
                    source.sync();
                }


                // update grid store content
                Ext.StoreMgr.get('Payload').load();
                Ext.ComponentQuery.query('#searchGrid')[0].getStore().load()

            }
        });
    }

});