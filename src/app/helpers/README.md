## Http requests to API

All request to API must be performed via ApiClient.
`mainApiPost` methods allows to avoid the many boilerplate code because of a specifics of API itself

In addition, you should to create `models.ts` and `reduce.ts` in a related module, where you call API requests

In most cases a file `models.ts` should contain interfaces with the prefix `Raw` for data models obtained from the API (please check if such a scheme has already been created)
Reason for this: wrong property naming (`magic` prefixes, mixed letter case), data types (string instead of number, `on`/`off` instead of boolean) and structure (objects with "flat" properties instead of nested objects). In general, transform the data to a form that you are comfortable working with it
The file `reduce.ts` may contain functions for transforming data from the API and vice versa. If an objects are tiny (2-3 properties), you can transform them in the ApiClient's method

For example:

```js
// BAD
{
    eg_id: '23',
    c_active: 'on',
    eg_name: 'example',
    c_addressLine: 'example'
    eg_date: '04-06-2019'
}

// GOOD
{
    id: 23,
    active: true,
    name: 'example',
    address: 'example',
    date: <Date object>
}
```

