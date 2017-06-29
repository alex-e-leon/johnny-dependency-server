const rosie = require('rosie');
const Factory = rosie.Factory;

let id = 0;

const component = new Factory()
  .attr('id', () => id++)
  .attr('name', 'fe-co-component1')
  .attr('version', '2.2.0')
  .attr('latestVersion', () => (Math.random() < 0.5) ? '2.3.0' : '2.2.0')
  .attr('children', null)
  ;

const componentWithChildren = new Factory()
  .attr('id', () => id++)
  .attr('name', 'fe-co-component2')
  .attr('version', '1.2.0')
  .attr('latestVersion', () => (Math.random() < 0.5) ? '1.5.0' : '2.2.0')
  .attr('children', () => [
    component.build(),
    component.build()
  ]);

const singleComponent = new Factory()
  .attr('id', () => id++)
  .attr('name', 'fe-co-test')
  .attr('version', '2.0.0')
  .attr('latestVersion', '2.0.0')
  .attr('children', () => [
    component.build(),
    component.build(),
    componentWithChildren.build(),
    componentWithChildren.build({children: [componentWithChildren.build()]}),
    component.build()
  ]);

const componentList = new Factory()
  .attr('components', [
    singleComponent.build(),
    componentWithChildren.build(),
    singleComponent.build(),
    singleComponent.build(),
    component.build(),
    singleComponent.build()
  ]);

module.exports = {
  componentList,
  singleComponent
};
