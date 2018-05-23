module Jekyll
  module DocsFilter
    def linear_pagination(docs)
      items = docs.map do |doc|
        doc_item_to_array doc
      end

      return items.flatten
      # {% assign docs = site.data.docs_navigation | map: 'children' | join: ',' | replace: '*', '' | | split: ',' %}
    end
  end
end

def doc_item_to_array(item)
  if item.is_a? String
    return item
  end

  # name or title, so with subchildren
  children = item["children"].map { |child| doc_item_to_array(child) }

  if item.key? "name"
    children.unshift item["name"]
  end

  return children
end

Liquid::Template.register_filter(Jekyll::DocsFilter)
