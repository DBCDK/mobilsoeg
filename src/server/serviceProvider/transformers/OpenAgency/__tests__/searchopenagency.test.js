'use strict';

import {assert} from 'chai';
import * as mocks from './searchopenagency.mock.js';
import SearchOpenAgencyTransform from '../searchOpenAgency.transform.js';

describe('Test SearchOpenAgency transform', () => {
  it('respond correctly on errors', () => {
    const obj = {error: {statusCode: '500', statusMessage: 'statusMessage'}};
    const expected = '{"error":true,"statusCode":"500","statusMessage":"statusMessage","query":"query"}';

    const response = JSON.stringify(SearchOpenAgencyTransform.responseTransform(obj, 'query'));
    assert.equal(response, expected, 'got object as expected');
  });

  it('should respond correctly on results from open-agency service', () => {
    const obj = mocks.searchOpenAgencyMock;
    const expected = '{"agencies":[{"agencyName":"Gladsaxe Bibliotekerne","agencyId":"715900","branchId":"715905","branchNameDan":"Værebro Bibliotek","branchPhone":"39 57 64 70","branchEmail":"bkbvaebib@gladsaxe.dk","postalAddress":"Værebrovej 72","postalCode":"2880","city":"Bagsværd","openingHoursDan":"man.: 13-18, tirs.-fre.: 10-16, lør.: 10-14. Selvbetjening: man.: 8-13, tirs.-fre.: 8-10, lør.: 8-10.","branchWebsiteUrl":"http://www.gladsaxe.dk/bibliotek"},{"agencyName":"Ballerup Bibliotekerne","agencyId":"715100","branchId":"715100","branchNameDan":"Ballerup Bibliotek","branchPhone":"44 77 33 33","branchEmail":"Ballerup-bibliotek@balk.dk","postalAddress":"Hovedbiblioteket Banegårdspladsen 1","postalCode":"2750","city":"Ballerup","openingHoursDan":"Ma.-to.: 10-19,  fre.: 10-17, lør.: 10-14.","branchWebsiteUrl":"https://bib.ballerup.dk"},{"agencyName":"Hjørring Bibliotekerne","agencyId":"786000","branchId":"786008","branchNameDan":"Bjergby","branchPhone":{},"branchEmail":{},"postalAddress":"Bjergby-Mygdal Skole Asdalvej 14 Bjergby","postalCode":"9800","city":"Hjørring","openingHoursDan":"","branchWebsiteUrl":"http://www.hjbib.dk"}]}'; // eslint-disable-line max-len

    const response = JSON.stringify(SearchOpenAgencyTransform.responseTransform(obj));
    assert.equal(response, expected, 'got object as expected');
  });
});
