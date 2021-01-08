## Permission based elements rendering and operations

Don't get company details (getCompanyDetails) each time and don't check properties in component for conditional access based on company details

- Declare `<permission id>:false` inside PermissionService -> can
- Set it in constructor: `this.can.<permission id> = company. // some condition` 

Rendering elements based on permission

- Don't show element `permission(id="<permission id>", dontShow)`
- Disabled element with tooltip `permission(id="<permission id>", tooltip="<text or i18>")`