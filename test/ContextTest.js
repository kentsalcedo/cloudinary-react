import React from 'react';
import {expect} from 'chai';
import {mount} from 'enzyme';
import cloudinary from './cloudinary-proxy';

const {Image, CloudinaryContext} = cloudinary;

describe('CloudinaryContext', () => {
  it("should pass properties to children", function () {
    let tag = mount(
      <CloudinaryContext className="root" cloudName="demo">
        <Image publicId="sample"/>
      </CloudinaryContext>
    );

    expect(tag.html().startsWith("<div")).to.equal(true);
    expect(tag.find("div").hasClass("root")).to.equal(true);
    expect(tag.children()).to.have.length(1);
    const img = tag.find("div").childAt(0);
    expect(img.html()).to.equal(`<img src="http://res.cloudinary.com/demo/image/upload/sample">`);
  });

  it("should render without div", function () {
    let tag = mount(
      <CloudinaryContext className="root" cloudName="demo" includeOwnBody={true}>
        <Image publicId="sample"/>
      </CloudinaryContext>
    );

    expect(tag.html().startsWith("<div")).to.equal(false);
  });
  it("should render with div", function () {
    let tag = mount(
      <CloudinaryContext className="root" cloudName="demo" includeOwnBody={false}>
        <Image publicId="sample"/>
      </CloudinaryContext>
    );

    expect(tag.html().startsWith("<div")).to.equal(true);
  });

  it("should pass properties to children with snake case", function () {
    const tag = mount(
      <CloudinaryContext className="root" cloudName="demo" fetch_format="auto">
        <Image publicId="sample"/>
      </CloudinaryContext>
    );

    const img = tag.find("div").childAt(0);
    expect(img.html()).to.equal(`<img src="http://res.cloudinary.com/demo/image/upload/f_auto/sample">`);
  });

  it("should pass properties to children with kebab case", function () {
    let tag = mount(
      <CloudinaryContext className="root" cloudName="demo" fetch-format="auto">
        <Image publicId="sample"/>
      </CloudinaryContext>
    );

    let img = tag.find("div").childAt(0);
    expect(img.html()).to.equal(`<img src="http://res.cloudinary.com/demo/image/upload/f_auto/sample">`);
  });

  it("should remove Cloudinary custom properties from CloudinaryContext component", function () {
    let html = mount(
      <CloudinaryContext
        className="root"
        cloudName="demo"
        quality="auto"
        secure="true"
        role="tab"
        aria-live="polite"
      >
        <Image publicId="sample"/>
      </CloudinaryContext>
    );

    const contextDiv = html.find("div");
    expect(contextDiv.find(".root").length).to.equal(1);
    expect(contextDiv.find("[role='tab']").length).to.equal(1);
    expect(contextDiv.find("[aria-live='polite']").length).to.equal(1);
    expect(contextDiv.find("[cloudName='demo']").length).to.equal(0);
    expect(contextDiv.find("[quality]").length).to.equal(0);

    // Verify that transformations from context are applied to components
    expect(contextDiv.find('img').prop("src")).to.equal("https://res.cloudinary.com/demo/image/upload/q_auto/sample");
  });

  it("should allow chained Contexts", function () {
    let tag = mount(
      <CloudinaryContext cloudName="demo">
        <CloudinaryContext width="100" crop="scale">
          <Image publicId="sample"/>
        </CloudinaryContext>
      </CloudinaryContext>
    );
    expect(
      tag.find('img').prop('src')
    ).to.equal("http://res.cloudinary.com/demo/image/upload/c_scale,w_100/sample");
  });

  it("should update url on context change", function () {
    const tag = mount(
      <CloudinaryContext cloudName="demo">
        <Image publicId="sample"/>
      </CloudinaryContext>
    );

    expect(tag.find('img').prop('src')).to.equal("http://res.cloudinary.com/demo/image/upload/sample");
    tag.setProps({cloudName: "demo2"}).update();
    expect(tag.find('img').prop('src')).to.equal("http://res.cloudinary.com/demo2/image/upload/sample");
  });
});
